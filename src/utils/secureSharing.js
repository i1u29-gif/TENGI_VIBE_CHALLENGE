/* Outbound actions require a current stored booking, preview and explicit consent. */
window.TengiApp = window.TengiApp || {};
(() => {
  const Wow = window.TengiApp.WowHelper;
  const Storage = window.TengiApp.StorageService;
  let active = null;
  let copyPending = false;
  let generation = 0;
  const el = (id) => document.getElementById(id);
  const explanations = {
    calendar: 'Google Calendar sẽ nhận thông tin này khi bạn tiếp tục. Bạn chọn tài khoản, lịch và bấm Lưu tại Google. TENGI không đọc lịch hoặc tự lưu sự kiện.',
    zalo: 'Sao chép và mở Zalo là hai thao tác riêng. Số điện thoại không chứng minh danh tính; hãy kiểm tra đúng người nhận trong Zalo rồi tự dán và gửi tin nhắn.',
    ics: 'File .ics là văn bản có thể đọc và chuyển tiếp. Nhãn Private không mã hóa file. TENGI không thể thu hồi file đã tải hoặc lịch đã nhập.'
  };
  function fingerprint(record) { return JSON.stringify(Wow.exportBooking(record)); }
  function current() {
    if (!active) throw new Error('Vui lòng chọn lại lịch hẹn.');
    const rec = Storage.getBookings().find((b) => b.id === active.id);
    if (!rec || fingerprint(rec) !== active.fingerprint) throw new Error('Lịch hẹn đã thay đổi hoặc bị xóa. Đóng cửa sổ và kiểm tra lại.');
    return rec;
  }
  function update() {
    if (!active) return;
    const rec = current();
    const personal = el('sharePersonal').checked;
    el('sharePreview').value = active.channel === 'zalo'
      ? Wow.buildZaloConfirmationText(rec, personal)
      : 'Tengi SmartHome — Lịch tư vấn\n' + Wow.sharedDetails(rec, personal);
    const consent = el('shareConsent').checked;
    el('shareExecute').disabled = !consent;
    el('shareCopy').disabled = !consent || copyPending;
  }
  function reset() {
    active = null; generation++; copyPending = false;
    el('sharePreview').value = '';
    el('shareRecipient').textContent = '';
    el('shareFeedback').textContent = '';
    el('sharePersonal').checked = el('shareConsent').checked = false;
    el('shareExecute').disabled = el('shareCopy').disabled = true;
  }
  function open(channel, id) {
    try {
      if (!Object.hasOwn(explanations, channel)) throw new Error('Thao tác không được phép.');
      const rec = Storage.getBookings().find((b) => b.id === id);
      if (!rec) throw new Error('Lịch hẹn đã bị xóa hoặc không còn trên trình duyệt này.');
      const booking = Wow.exportBooking(rec);
      if (channel === 'zalo') Wow.buildZaloUrl(booking);
      const dialog = el('shareDialog');
      if (dialog.open) return;
      reset();
      active = { channel, id, fingerprint: fingerprint(rec) };
      el('shareExplanation').textContent = explanations[channel];
      el('shareRecipient').hidden = channel !== 'zalo';
      el('shareRecipient').textContent = channel === 'zalo' ? 'Số Zalo sẽ mở: ' + booking.phone : '';
      el('shareCopy').hidden = channel !== 'zalo';
      el('shareExecute').textContent = { calendar: 'Mở Google Calendar', zalo: 'Mở Zalo', ics: 'Tải file .ics' }[channel];
      update();
      dialog.showModal();
    } catch (error) { window.alert(error.message); }
  }
  async function copy() {
    const op = generation;
    try {
      if (copyPending || !active || active.channel !== 'zalo' || !el('shareConsent').checked) return;
      update(); current();
      const text = el('sharePreview').value;
      copyPending = true; update();
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if (op === generation) el('shareFeedback').textContent = 'Đã sao chép nội dung. Hãy kiểm tra người nhận trước khi dán và gửi trong Zalo.';
    } catch {
      if (op === generation) {
        el('shareFeedback').textContent = 'Không thể sao chép tự động. Chọn nội dung trong ô xem trước và sao chép thủ công.';
        el('sharePreview').focus(); el('sharePreview').select();
      }
    } finally {
      if (op === generation) {
        copyPending = false;
        try { update(); } catch (error) { el('shareFeedback').textContent = error.message; el('shareExecute').disabled = el('shareCopy').disabled = true; }
      }
    }
  }
  function execute() {
    try {
      if (!active || !el('shareConsent').checked) return;
      const rec = current();
      const personal = el('sharePersonal').checked;
      if (active.channel === 'ics') {
        Wow.downloadIcsFile(rec, personal);
        el('shareFeedback').textContent = 'Đã tạo file và yêu cầu trình duyệt tải xuống. File đã chia sẻ không thể thu hồi từ TENGI.';
      } else {
        const url = active.channel === 'calendar' ? Wow.buildGoogleCalendarUrl(rec, personal) : Wow.buildZaloUrl(rec);
        const a = document.createElement('a');
        a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.referrerPolicy = 'no-referrer';
        document.body.appendChild(a); a.click(); a.remove();
        el('shareFeedback').textContent = active.channel === 'calendar'
          ? 'Đã yêu cầu mở Google Calendar. Bạn cần bấm Lưu ở Google; TENGI chưa thể xác nhận lịch đã được lưu.'
          : 'Đã yêu cầu mở Zalo. Tin nhắn chưa được gửi; hãy kiểm tra người nhận và tự dán, gửi nội dung.';
      }
    } catch (error) {
      el('shareConsent').checked = false;
      el('shareExecute').disabled = el('shareCopy').disabled = true;
      el('shareFeedback').textContent = error.message;
    }
  }
  window.TengiApp.SecureSharing = { open };
  document.addEventListener('DOMContentLoaded', () => {
    const dialog = el('shareDialog');
    // Native dialog provides focus containment and Escape dismissal.
    dialog.addEventListener('close', () => { if (!dialog.open) reset(); });
    el('shareClose').addEventListener('click', () => { dialog.close(); reset(); });
    el('sharePersonal').addEventListener('change', () => {
      generation++; copyPending = false;
      el('shareConsent').checked = false; el('shareFeedback').textContent = '';
      try { update(); } catch (error) { el('shareFeedback').textContent = error.message; }
    });
    el('shareConsent').addEventListener('change', () => {
      try { update(); } catch (error) { el('shareFeedback').textContent = error.message; el('shareExecute').disabled = el('shareCopy').disabled = true; }
    });
    el('shareCopy').addEventListener('click', copy);
    el('shareExecute').addEventListener('click', execute);
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-booking-action]');
      if (!button) return;
      const { bookingAction: action, bookingId: id } = button.dataset;
      if (action === 'delete') window.deleteBooking(id);
      else open(action, id);
    });
  });
})();
