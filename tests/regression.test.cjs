// Optional developer checks: node --test tests/regression.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function app() {
  const storage = new Map();
  const context = vm.createContext({ window: {}, console, Date, URL, URLSearchParams, TextEncoder,
    setTimeout, clearTimeout, AbortController, crypto: require('node:crypto').webcrypto,
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,String(v)) },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} } });
  for (const file of ['data/faqData.js','utils/validator.js','utils/wowHelper.js','services/storageService.js','services/aiService.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../src', file),'utf8'), context);
  }
  return context.window.TengiApp;
}
test('TC05: custom/industrial questions go to booking with three suggestions in both API states', async () => {
  const a = app();
  a.AIService.fetchWithTimeout = async () => { throw new Error('An unsupported request must not reach the model'); };
  for (const question of [
    'Tôi muốn thiết kế riêng hệ thống BMS công nghiệp cho tòa nhà 25 tầng tại Hà Nội thì báo giá sao?',
    'Bao gia BMS cho toa nha 30 tang', 'Báo giá lập trình PLC và SCADA cho nhà máy',
    'Tư vấn thiết kế riêng camera cho nhà xưởng', '1+1 bằng bao nhiêu?'
  ]) for (const key of ['', 'fake-key-for-test-only']) {
    const r = await a.AIService.generateResponse(question, a.FAQ_DATA, key);
    assert.equal(r.can_answer,false); assert.equal(r.suggested_questions.length,3);
    assert(!r.answer.includes('4.900.000'));
  }
});
test('All 10 canonical FAQs still return their known local answers and three suggestions', () => {
  const a=app();
  for(const f of a.FAQ_DATA){const r=a.AIService.localSmartFallback(f.question,a.FAQ_DATA);
    assert.equal(r.can_answer,true);assert(r.answer.includes(f.answer));assert.equal(r.suggested_questions.length,3);}
});
test('TC02: future slots, business hours, duplicates and date/year rollover', () => {
  const a=app();
  for(const when of ['2026-11-08T15:30:00','2026-11-08T21:30:00','2026-12-31T23:58:00','2026-11-08T07:01:00']){
    const now=new Date(when), existing=[];
    for(let i=0;i<3;i++){
      const slot=a.WowHelper.getNextAvailableBookingSlot('0912345678',existing,now);
      assert(new Date(slot.date+'T'+slot.time+':00')>now);
      assert(Number(slot.time.slice(0,2))>=8&&Number(slot.time.slice(0,2))<20);
      assert(!existing.some(b=>b.date===slot.date&&b.time===slot.time));
      existing.push({phone:'0912345678',...slot});
    }
  }
});
test('Processed status keeps records; deleting removes only the selected record', () => {
  const a=app(), s=a.StorageService;
  const one=s.addBooking({name:'Khách thử',phone:'0912345678',date:'2026-12-01',time:'09:00',note:''}).record;
  const two=s.addBooking({name:'Khách thử 2',phone:'0987654321',date:'2026-12-01',time:'10:00',note:''}).record;
  assert.equal(s.markBookingProcessed(one.id).success,true);
  assert.equal(s.getBookings().length,2);assert.equal(s.getBookings().find(b=>b.id===one.id).status,'processed');
  assert.equal(s.deleteBookingById(one.id).success,true);assert.equal(s.getBookings().length,1);assert.equal(s.getBookings()[0].id,two.id);
});
