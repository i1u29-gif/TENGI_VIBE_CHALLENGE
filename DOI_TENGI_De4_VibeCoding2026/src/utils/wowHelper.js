/**
 * Tầng Tính Năng Nâng Cao "ĐIỂM WOW" & "LÀM MƯỢT" (Kano Attractive & Performance Layer)
 * 1. Âm thanh báo tin nhắn & xác nhận đặt lịch bằng Web Audio API (Không cần file MP3 ngoài, không bao giờ lỗi 404).
 * 2. Tạo Link thêm trực tiếp vào Google Calendar (Template URL chuẩn) & Tải file lịch (.ics).
 * 3. Gửi/Chia sẻ xác nhận lịch hẹn qua Zalo (`https://zalo.me/...` + Sao chép tin nhắn mẫu chuẩn Zalo).
 * 4. Tự động tính toán và điền sẵn Ngày hôm nay + Khung giờ hợp lệ gần nhất (Smart Auto-fill Today).
 */
window.TengiApp = window.TengiApp || {};

window.TengiApp.WowHelper = {
  soundEnabled: true,
  audioCtx: null,

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  },

  // Phát âm thanh "Pop / Ting" nhẹ nhàng khi có tin nhắn mới hoặc xác nhận lịch
  playNotificationSound(type = "bot") {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "user") {
        // Âm gửi đi nhẹ (440Hz -> 587Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === "booking_success") {
        // Âm chuông đôi xác nhận thành công (523Hz -> 659Hz -> 784Hz)
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
        osc.start(now);
        osc.stop(now + 0.42);
      } else {
        // Âm nhận tin nhắn từ Bot (660Hz -> 880Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch (e) {
      // Bỏ qua nếu trình duyệt chặn autoplay trước khi tương tác
    }
  },

  // Tự điền ngày giờ hôm nay thông minh (Kano Làm Mượt)
  getSmartDefaultDateTime() {
    const now = new Date();
    // Cộng thêm 30 phút làm tròn để luôn hợp lệ ở thời điểm hiện tại
    const future = new Date(now.getTime() + 30 * 60 * 1000);
    let hour = future.getHours();
    let minute = future.getMinutes() < 30 ? "30" : "00";
    if (minute === "00") {
      hour += 1;
    }

    let targetDate = new Date(now);
    // Nếu hiện tại sau 19:30 tối, mặc định giờ là 09:30 nhưng vẫn cho phép chọn hôm nay hoặc ngày mai
    if (hour >= 20) {
      hour = 9;
      minute = "30";
      targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (hour < 8) {
      hour = 8;
      minute = "30";
    }

    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");
    const hh = String(hour).padStart(2, "0");

    const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    return {
      minDate: todayYMD,
      defaultDate: `${yyyy}-${mm}-${dd}`,
      defaultTime: `${hh}:${minute}`
    };
  },

  // All outbound data is revalidated, including records restored from storage.
  exportBooking(raw) {
    if (!raw || !/^[A-Za-z0-9_-]{1,80}$/.test(raw.id || "")) throw new Error("Mã lịch hẹn không hợp lệ.");
    const text = (v, max) => {
      if (typeof v !== "string" || v.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(v)) {
        throw new Error("Thông tin lịch hẹn chứa ký tự hoặc độ dài không hợp lệ.");
      }
      return v.replace(/\r\n?/g, "\n").trim();
    };
    const name = text(raw.name, 80).replace(/\s+/g, " ");
    const phone = text(raw.phone, 20);
    const note = text(raw.note || "", 300);
    if (!name || !/^0[35789]\d{8}$/.test(phone)) throw new Error("Tên hoặc số điện thoại lịch hẹn không hợp lệ.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.date || "") || !/^([01]\d|2[0-3]):[0-5]\d$/.test(raw.time || "")) {
      throw new Error("Ngày giờ lịch hẹn không hợp lệ.");
    }
    const start = new Date(raw.date + "T" + raw.time + ":00+07:00");
    if (!Number.isFinite(start.getTime()) || new Date(start.getTime() + 7 * 3600000).toISOString().slice(0, 16) !== raw.date + "T" + raw.time) {
      throw new Error("Ngày giờ lịch hẹn không tồn tại.");
    }
    return { id: raw.id, name, phone, note, date: raw.date, time: raw.time, start,
      end: new Date(start.getTime() + 45 * 60000) };
  },

  sharedDetails(booking, includePersonal = false) {
    const b = this.exportBooking(booking);
    let text = "Mã lịch hẹn: " + b.id + "\nThời gian: " + b.time + " ngày " + b.date + " (giờ Việt Nam).";
    if (includePersonal) text += "\nKhách hàng: " + b.name + "\nSố điện thoại: " + b.phone + "\nNội dung: " + b.note;
    return text;
  },

  safeExternalUrl(value, host, path) {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== host || url.port || url.username || url.password ||
        (path && url.pathname !== path)) throw new Error("Liên kết bên ngoài không được phép.");
    return url.href;
  },

  buildGoogleCalendarUrl(booking, includePersonal = false) {
    const b = this.exportBooking(booking);
    const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const url = new URL("https://calendar.google.com/calendar/render");
    url.search = new URLSearchParams({ action: "TEMPLATE", text: "Tengi SmartHome — Lịch tư vấn",
      dates: stamp(b.start) + "/" + stamp(b.end), ctz: "Asia/Ho_Chi_Minh",
      details: this.sharedDetails(b, includePersonal) }).toString();
    return this.safeExternalUrl(url.href, "calendar.google.com", "/calendar/render");
  },

  buildZaloUrl(booking) {
    const b = this.exportBooking(booking);
    return this.safeExternalUrl("https://zalo.me/" + b.phone, "zalo.me", "/" + b.phone);
  },

  buildZaloConfirmationText(booking, includePersonal = false) {
    return "[LỊCH HẸN — TENGI SMARTHOME]\n" + this.sharedDetails(booking, includePersonal);
  },

  escapeIcsText(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n")
      .replace(/;/g, "\\;").replace(/,/g, "\\,");
  },

  foldIcsLine(line) {
    // 75 octets, including the leading space of each continuation line.
    const encoder = new TextEncoder();
    let output = "", current = "", bytes = 0;
    for (const char of line) {
      const size = encoder.encode(char).length;
      if (bytes + size > 75) { output += current + "\r\n"; current = " "; bytes = 1; }
      current += char; bytes += size;
    }
    return output + current;
  },

  buildIcsContent(booking, includePersonal = false) {
    const b = this.exportBooking(booking);
    const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Tengi SmartHome//Booking//VI", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT", "UID:" + b.id + "@tengi.local", "DTSTAMP:" + stamp(new Date()),
      "DTSTART:" + stamp(b.start), "DTEND:" + stamp(b.end),
      "SUMMARY:Tengi SmartHome — Lịch tư vấn", "DESCRIPTION:" + this.escapeIcsText(this.sharedDetails(b, includePersonal)),
      "CLASS:PRIVATE", "TRANSP:OPAQUE", "END:VEVENT", "END:VCALENDAR"]
      .map((line) => this.foldIcsLine(line)).join("\r\n") + "\r\n";
  },

  downloadIcsFile(booking, includePersonal = false) {
    const b = this.exportBooking(booking);
    const blob = new Blob([this.buildIcsContent(b, includePersonal)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Lich_Hen_" + b.id + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
