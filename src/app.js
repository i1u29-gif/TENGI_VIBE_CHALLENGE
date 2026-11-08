/**
 * Application Controller — v8 Monochrome
 * Thiết kế tinh gọn, nhân bản, tập trung vào độ rõ ràng của thông tin (Clarity & Hierarchy)
 */
window.TengiApp = window.TengiApp || {};

(function () {
  const FAQ_DATA = window.TengiApp.FAQ_DATA;
  const Validator = window.TengiApp.Validator;
  const Storage = window.TengiApp.StorageService;
  const AIService = window.TengiApp.AIService;
  const Wow = window.TengiApp.WowHelper;

  let lastUnansweredQuestion = "";
  let latestBookingMap = {};

  window.addEventListener("DOMContentLoaded", () => {
    initSmartDateTimeDefaults();
    initApiKeyStatus();
    renderFaqList();
    renderAdminBookings();

    appendBotMessage(
      "Xin chào! Mình là bộ phận hỗ trợ trực tuyến 24/7 của **Tengi SmartHome**. Bạn có thể chọn nhanh các câu hỏi phổ biến bên dưới (về báo giá, thời gian thi công, chính sách bảo hành) hoặc đặt lịch hẹn để kỹ thuật viên khảo sát trực tiếp.",
      true,
      "SYSTEM_INIT"
    );
    renderSuggestedQuestions([FAQ_DATA[0].question, FAQ_DATA[1].question, FAQ_DATA[2].question]);
  });

  function initSmartDateTimeDefaults() {
    const smart = Wow.getSmartDefaultDateTime();
    const dateInput = document.getElementById("bookDate");
    const timeInput = document.getElementById("bookTime");
    if (dateInput) {
      dateInput.min = smart.minDate;
      dateInput.value = smart.defaultDate;
    }
    if (timeInput) {
      timeInput.value = smart.defaultTime;
    }
  }

  window.fillTodayNow = function () {
    initSmartDateTimeDefaults();
    showToast("Đã tự động điền ngày hôm nay và khung giờ gần nhất.");
  };

  window.toggleSoundNotification = function () {
    Wow.soundEnabled = !Wow.soundEnabled;
    const btn = document.getElementById("btnSoundToggle");
    if (btn) {
      btn.innerHTML = window.TengiIcons.icon(Wow.soundEnabled ? "volume" : "muted") + (Wow.soundEnabled ? "Âm báo: Bật" : "Âm báo: Tắt");
      btn.setAttribute("aria-pressed", String(Wow.soundEnabled));
      btn.className = Wow.soundEnabled
        ? "px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200 hover:bg-neutral-200/70 transition"
        : "px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-neutral-400 border border-neutral-200 hover:text-neutral-600 transition";
    }
    if (Wow.soundEnabled) {
      Wow.playNotificationSound("bot");
    }
  };

  function showApiStatus(message, state) {
    const status = document.getElementById("apiConnectionStatus");
    status.textContent = message;
    status.dataset.state = state;
    status.setAttribute("role", state === "error" ? "alert" : "status");
  }

  function initApiKeyStatus() {
    const savedKey = Storage.getApiKey();
    const input = document.getElementById("apiKeyInput");
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") { event.preventDefault(); window.saveApiKeyFromUI(); }
    });
    updateAiModeBadge();
    if (savedKey) {
      input.value = savedKey;
      window.saveApiKeyFromUI();
    }
    const header = document.querySelector("header");
    if (window.ResizeObserver) new ResizeObserver(() => {
      document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
    }).observe(header);
  }

  let connecting = false;
  window.saveApiKeyFromUI = async function () {
    if (connecting) return;
    const input = document.getElementById("apiKeyInput");
    const button = document.getElementById("btnConnectApi");
    const cleanKey = AIService.sanitizeApiKey(input.value);
    input.value = cleanKey;
    Storage.setApiKey("");
    AIService.resetConnection();
    updateAiModeBadge();
    input.removeAttribute("aria-invalid");
    if (!cleanKey) {
      showApiStatus("API không hợp lệ. Vui lòng nhập khóa Gemini API.", "error");
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    connecting = true;
    input.disabled = button.disabled = true;
    button.textContent = "Đang kiểm tra…";
    button.setAttribute("aria-busy", "true");
    showApiStatus("Đang xác thực API và chờ phản hồi từ AI…", "pending");
    try {
      const result = await AIService.validateConnection(cleanKey);
      Storage.setApiKey(cleanKey);
      showApiStatus("Đã kết nối được với Agent " + result.name + " (" + result.model + ").", "success");
      showToast("Đã kết nối được với Agent " + result.name + ".");
      Wow.playNotificationSound("booking_success");
    } catch (error) {
      AIService.resetConnection();
      const message = AIService.connectionErrorMessage(error);
      showApiStatus(message, "error");
      showToast(message);
      if (message.startsWith("API không hợp lệ")) input.setAttribute("aria-invalid", "true");
    } finally {
      connecting = false;
      input.disabled = button.disabled = false;
      button.innerHTML = window.TengiIcons.icon("link") + "Kết nối";
      button.removeAttribute("aria-busy");
      updateAiModeBadge();
    }
  };

  window.disconnectApi = function () {
    if (connecting) return;
    Storage.setApiKey("");
    AIService.resetConnection();
    const input = document.getElementById("apiKeyInput");
    input.value = "";
    input.removeAttribute("aria-invalid");
    showApiStatus("Đang sử dụng dữ liệu kịch bản nội bộ.", "local");
    updateAiModeBadge();
  };

  function updateAiModeBadge() {
    const badge = document.getElementById("aiModeBadge");
    const connected = !!Storage.getApiKey() && AIService.connection.status === "connected";
    badge.dataset.state = connected ? "connected" : "local";
    badge.innerHTML = '<span class="connection-dot"></span>' + (connected
      ? "Agent: " + Validator.escapeHtml(AIService.connection.name)
      : AIService.connection.status === "interrupted" ? "AI tạm gián đoạn · Kịch bản nội bộ" : "Chế độ Kịch bản (Local)");
    document.getElementById("btnDisconnectApi").hidden = !Storage.getApiKey();
  }

  function renderFaqList() {
    const container = document.getElementById("faqListContainer");
    if (!container) return;
    container.innerHTML = FAQ_DATA.map(
      (item, idx) => `
      <button type="button" onclick="window.askQuestion('${item.question.replace(/'/g, "\\'")}')"
        class="w-full text-left text-[13px] bg-white hover:bg-neutral-50 border border-neutral-200/90 hover:border-neutral-300 rounded-lg px-3 py-2.5 text-neutral-700 hover:text-neutral-950 transition flex items-start gap-2.5 group">
        <span class="font-mono-code text-[11px] text-neutral-400 group-hover:text-neutral-700 font-medium pt-0.5 shrink-0">${window.TengiIcons.icon(["pin", "tag", "shield", "clock", "home", "wifi", "card", "settings", "phone", "help"][idx] || "help")}</span>
        <span class="leading-snug">${Validator.escapeHtml(item.question)}</span><span class="faq-arrow">${window.TengiIcons.icon("arrow")}</span>
      </button>
    `
    ).join("");
  }

  window.handleChatSubmit = function (e) {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const rawText = input ? input.value : "";
    window.askQuestion(rawText, true);
  };

  window.askQuestion = async function (rawText, clearInput = false, forceSimulateError = false) {
    const check = Validator.validateChatMessage(rawText);
    const errorBanner = document.getElementById("chatErrorBanner");

    if (!check.valid) {
      if (errorBanner) {
        errorBanner.textContent = check.error;
        errorBanner.classList.remove("hidden");
      }
      return;
    }

    if (errorBanner) errorBanner.classList.add("hidden");
    if (clearInput) {
      const input = document.getElementById("chatInput");
      if (input) input.value = "";
    }

    appendUserMessage(check.sanitized);
    Wow.playNotificationSound("user");

    const loaderId = appendTypingIndicator();

    const apiKey = Storage.getApiKey();
    const aiResponse = await AIService.generateResponse(check.sanitized, FAQ_DATA, apiKey, forceSimulateError);

    removeTypingIndicator(loaderId);
    updateAiModeBadge();
    if (AIService.connection.status === "interrupted") {
      showApiStatus(aiResponse.notice || "Kết nối AI tạm gián đoạn.", "error");
    } else if (aiResponse.source === "GEMINI_API_REAL") {
      showApiStatus("Đã kết nối được với Agent " + AIService.connection.name + " (" + AIService.resolvedModel + ").", "success");
    }

    if (!aiResponse.can_answer) {
      lastUnansweredQuestion = check.sanitized;
    }

    appendBotMessage(aiResponse.answer, aiResponse.can_answer, aiResponse.source, aiResponse.notice);
    Wow.playNotificationSound("bot");
    renderSuggestedQuestions(aiResponse.suggested_questions);
    return aiResponse;
  };

  function appendUserMessage(text) {
    const box = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.className = "flex justify-end msg-animate";
    div.innerHTML = `
      <div class="bg-neutral-900 text-white text-[13.5px] px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[80%] leading-relaxed shadow-sm break-words">
        ${Validator.escapeHtml(text)}
      </div>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function appendBotMessage(text, canAnswer, sourceTag = "", notice = null, wowBookingRecord = null) {
    const box = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.className = "flex justify-start items-start gap-3 msg-animate";

    const safeHtml = Validator.escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-neutral-900'>$1</strong>")
      .replace(/\n/g, "<br/>");

    const sourceLabel =
      sourceTag === "GEMINI_API_REAL"
        ? `<span class="text-[11px] text-neutral-700 font-mono-code">Gemini API · ${Validator.escapeHtml(AIService.resolvedModel || "gemini-2.5-flash")}</span>`
        : sourceTag === "FALLBACK_RECOVERY"
        ? `<span class="text-[11px] text-neutral-700 font-mono-code">Chế độ dự phòng an toàn (Fallback)</span>`
        : `<span class="text-[11px] text-neutral-400 font-mono-code">Tengi Support</span>`;

    const noticeHtml = notice
      ? `<div class="mb-2.5 text-xs bg-neutral-50 border border-neutral-200 text-neutral-900 px-3 py-2 rounded-lg">${Validator.escapeHtml(notice)}</div>`
      : "";

    const ctaHtml = !canAnswer
      ? `
      <div class="mt-3 pt-3 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs text-neutral-600">Yêu cầu này cần kỹ thuật viên báo giá/khảo sát chi tiết hơn:</span>
        <button type="button" onclick="window.openBookingModal(true)"
          class="bg-neutral-700 hover:bg-neutral-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition">
          Đặt lịch hẹn tư vấn →
        </button>
      </div>
    `
      : "";

    let wowCardHtml = "";
    if (wowBookingRecord) {
      latestBookingMap[wowBookingRecord.id] = wowBookingRecord;
      wowCardHtml = `
        <div data-booking-card="${Validator.escapeHtml(wowBookingRecord.id)}" class="mt-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
          <div class="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-neutral-50 px-2.5 py-0.5 rounded-md border border-neutral-200">
              ✓ Đã xác nhận lịch hẹn · ${Validator.escapeHtml(wowBookingRecord.id)}
            </span>
            <span class="text-xs text-neutral-600 font-mono-code">${Validator.escapeHtml(wowBookingRecord.time)} · ${Validator.escapeHtml(wowBookingRecord.date)}</span>
          </div>
          <div class="text-xs text-neutral-600 space-y-1">
            <div><span class="text-neutral-400">Khách hàng:</span> <strong class="text-neutral-800">${Validator.escapeHtml(wowBookingRecord.name)}</strong> (${Validator.escapeHtml(wowBookingRecord.phone)})</div>
            <div><span class="text-neutral-400">Nội dung:</span> ${Validator.escapeHtml(wowBookingRecord.note)}</div>
          </div>
          <div class="pt-1 flex flex-wrap gap-2">
            <button type="button" data-booking-action="calendar" data-booking-id="${Validator.escapeHtml(wowBookingRecord.id)}"
              class="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition">
              ${window.TengiIcons.icon("calendar")} Thêm vào Google Calendar
            </button>
            <button type="button" data-booking-action="zalo" data-booking-id="${Validator.escapeHtml(wowBookingRecord.id)}"
              class="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-medium text-xs px-3 py-1.5 rounded-lg transition">
              ${window.TengiIcons.icon("send")} Gửi phiếu hẹn qua Zalo
            </button>
            <button type="button" data-booking-action="ics" data-booking-id="${Validator.escapeHtml(wowBookingRecord.id)}"
              class="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 font-medium text-xs px-2.5 py-1.5 rounded-lg transition">
              ${window.TengiIcons.icon("download")} Tải file .ics
            </button>
          </div>
        </div>
      `;
    }

    div.innerHTML = `
      <img src="assets/tengi-avatar.jpg" alt="Tengi Support" width="32" height="32" class="tengi-avatar tengi-avatar-chat" />
      <div class="bg-white border border-neutral-200/90 text-neutral-800 text-[13.5px] px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-xs leading-relaxed">
        ${noticeHtml}
        <div>${safeHtml}</div>
        ${ctaHtml}
        ${wowCardHtml}
        <div class="mt-1.5 flex justify-end">${sourceLabel}</div>
      </div>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  window.shareBookingViaZalo = (id) => window.TengiApp.SecureSharing.open("zalo", id);
  window.downloadBookingIcs = (id) => window.TengiApp.SecureSharing.open("ics", id);

  function renderSuggestedQuestions(questions) {
    const container = document.getElementById("suggestedChips");
    if (!container) return;
    container.innerHTML = (questions || []).slice(0, 3).map(
      (q) => `
      <button type="button" onclick="window.askQuestion('${q.replace(/'/g, "\\'")}')"
        class="text-xs bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 border border-neutral-200 hover:border-neutral-300 px-3 py-1.5 rounded-full transition text-left">
        ${Validator.escapeHtml(q)}
      </button>
    `
    ).join("");
  }

  function appendTypingIndicator() {
    const id = "loader_" + Date.now();
    const box = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.id = id;
    div.className = "flex justify-start items-center gap-3 msg-animate";
    div.innerHTML = `
      <img src="assets/tengi-avatar.jpg" alt="Tengi Support" width="32" height="32" class="tengi-avatar tengi-avatar-chat" />
      <div class="bg-white border border-neutral-200 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2">
        <div class="flex items-center gap-1">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
        <span class="text-xs text-neutral-500">Đang phản hồi...</span>
      </div>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  window.openBookingModal = function (prefill = false) {
    const modal = document.getElementById("bookingModal");
    const errBox = document.getElementById("bookingFormError");
    const noteEl = document.getElementById("bookNote");
    if (errBox) errBox.classList.add("hidden");

    initSmartDateTimeDefaults();

    if (prefill && lastUnansweredQuestion && noteEl) {
      noteEl.value = `Cần tư vấn: ${lastUnansweredQuestion}`;
    }
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  window.closeBookingModal = function () {
    const modal = document.getElementById("bookingModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  window.handleBookingSubmit = function (e) {
    e.preventDefault();
    const rawData = {
      name: document.getElementById("bookName").value,
      phone: document.getElementById("bookPhone").value,
      date: document.getElementById("bookDate").value,
      time: document.getElementById("bookTime").value,
      note: document.getElementById("bookNote").value
    };

    const existing = Storage.getBookings();
    const validation = Validator.validateBookingForm(rawData, existing);
    const errBox = document.getElementById("bookingFormError");

    if (!validation.valid) {
      errBox.textContent = validation.error;
      errBox.classList.remove("hidden");
      const targetField = document.getElementById(validation.field);
      if (targetField) targetField.focus();
      return;
    }

    errBox.classList.add("hidden");
    const result = Storage.addBooking(validation.sanitized);

    if (!result.success) {
      errBox.textContent = result.error;
      errBox.classList.remove("hidden");
      return;
    }

    document.getElementById("bookingForm").reset();
    initSmartDateTimeDefaults();
    window.closeBookingModal();
    renderAdminBookings();

    const rec = result.record;
    Wow.playNotificationSound("booking_success");

    appendBotMessage(
      `Lịch hẹn tư vấn của bạn đã được ghi nhận vào hệ thống. Bạn có thể lưu lịch vào Google Calendar hoặc gửi thông tin phiếu hẹn qua Zalo theo các tùy chọn dưới đây:`,
      true,
      "BOOKING_SYSTEM",
      null,
      rec
    );
    showToast(`Đã lưu lịch hẹn ${rec.id} thành công.`);
  };

  window.renderAdminBookings = function () {
    const bookings = Storage.getBookings();
    const tbody = document.getElementById("adminTableBody");
    const badge = document.getElementById("adminCountBadge");
    const statCount = document.getElementById("statTotalBookings");

    if (badge) badge.textContent = bookings.length;
    if (statCount) statCount.textContent = bookings.filter((b) => b.status !== "processed").length;
    if (!tbody) return;

    if (bookings.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-10 text-center text-neutral-400 text-sm">
            <div class="empty-state">${window.TengiIcons.icon("calendar")}<strong>Chưa có lịch hẹn</strong><span>Các yêu cầu khảo sát mới sẽ xuất hiện tại đây.</span><button type="button" onclick="window.openBookingModal(false)">Tạo lịch hẹn đầu tiên ${window.TengiIcons.icon("arrow")}</button></div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = bookings
      .map((b) => {
        latestBookingMap[b.id] = b;
        return `
      <tr class="hover:bg-neutral-50/80 transition">
        <td data-label="Mã phiếu" class="py-3.5 px-4 font-mono-code text-xs text-neutral-700 font-semibold">${Validator.escapeHtml(b.id)}</td>
        <td data-label="Khách hàng" class="py-3.5 px-4 font-medium text-neutral-900">${Validator.escapeHtml(b.name)}<span class="booking-status" data-state="${b.status === "processed" ? "processed" : "pending"}">${b.status === "processed" ? "Đã xử lý" : "Chờ xử lý"}</span></td>
        <td data-label="Số điện thoại" class="py-3.5 px-4 text-neutral-600 font-mono-code text-xs">${Validator.escapeHtml(b.phone)}</td>
        <td data-label="Thời gian hẹn" class="py-3.5 px-4">
          <span class="bg-neutral-100 text-neutral-700 border border-neutral-200 px-2.5 py-1 rounded-md text-xs font-mono-code">
            ${Validator.escapeHtml(b.time)} · ${Validator.escapeHtml(b.date)}
          </span>
        </td>
        <td data-label="Nội dung tư vấn" class="py-3.5 px-4 text-xs text-neutral-600 max-w-xs break-words">${Validator.escapeHtml(b.note)}</td>
        <td data-label="Thao tác" class="py-3.5 px-4 text-right space-x-1.5">
          <button type="button" data-booking-action="calendar" data-booking-id="${Validator.escapeHtml(b.id)}"
            class="inline-block bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-2.5 py-1 rounded-md text-xs font-medium transition">
            Lịch Google
          </button>
          <button type="button" data-booking-action="zalo" data-booking-id="${Validator.escapeHtml(b.id)}"
            class="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-2.5 py-1 rounded-md text-xs font-medium transition">
            Zalo
          </button>
          <select data-booking-menu data-booking-id="${Validator.escapeHtml(b.id)}" aria-label="Chọn thao tác cho lịch hẹn ${Validator.escapeHtml(b.id)}" class="booking-action-menu">
            <option value="">Chọn thao tác…</option>
            <option value="process" ${b.status === "processed" ? "disabled" : ""}>Đánh dấu đã xử lý</option>
            <option value="delete">Xóa lịch hẹn</option>
          </select>
        </td>
      </tr>
    `;
      })
      .join("");
  };

  window.processBooking = function (id) {
    const result = Storage.markBookingProcessed(id);
    if (!result.success) { showToast(result.error); return; }
    renderAdminBookings();
    showToast("Đã đánh dấu lịch hẹn " + id + " là đã xử lý. Bản ghi được giữ lại.");
  };

  document.addEventListener("change", (event) => {
    const menu = event.target.closest("select[data-booking-menu]");
    if (!menu) return;
    const action = menu.value;
    menu.value = "";
    if (action === "process") window.processBooking(menu.dataset.bookingId);
    else if (action === "delete") window.deleteBooking(menu.dataset.bookingId);
  });

  window.deleteBooking = function (id) {
    if (!window.confirm("Xóa lịch hẹn trên trình duyệt này? Bản đã chia sẻ hoặc tải xuống sẽ không bị thu hồi.")) return;
    const result = Storage.deleteBookingById(id);
    if (!result.success) { showToast(result.error); return; }
    delete latestBookingMap[id];
    document.querySelectorAll("[data-booking-card]").forEach((card) => {
      if (card.dataset.bookingCard === id) card.remove();
    });
    renderAdminBookings();
    showToast(`Đã xóa lịch hẹn ${id}.`);
  };

  window.clearAllBookings = function () {
    if (!window.confirm("Xóa tất cả lịch hẹn trên trình duyệt này? Thao tác này không thu hồi dữ liệu đã chia sẻ.")) return;
    const result = Storage.clearAll();
    if (!result.success) { showToast(result.error); return; }
    latestBookingMap = {};
    document.querySelectorAll("[data-booking-card]").forEach((card) => card.remove());
    document.getElementById("bookingForm").reset();
    initSmartDateTimeDefaults();
    renderAdminBookings();
    showToast("Đã xóa toàn bộ danh sách lịch hẹn.");
  };

  window.switchTab = function (tabName) {
    const tabs = ["customer", "admin", "testcases"];
    tabs.forEach((t) => {
      const sec = document.getElementById(`view-${t}`);
      const btn = document.getElementById(`tab-${t}`);
      if (sec) {
        if (t === tabName) sec.classList.remove("hidden");
        else sec.classList.add("hidden");
      }
      if (btn) {
        if (t === tabName) {
          btn.className = "px-3 py-1.5 rounded-md text-xs font-semibold transition bg-white text-neutral-900 shadow-xs border border-neutral-200/80 flex items-center gap-1.5";
        } else {
          btn.className = "px-3 py-1.5 rounded-md text-xs font-medium transition text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5";
        }
      }
    });
    if (tabName === "admin") renderAdminBookings();
  };

  const runningCases = new Set();
  function setCaseResult(number, message, state) {
    const cell = document.getElementById("testResult" + number);
    if (cell) { cell.textContent = message; cell.dataset.state = state; }
  }
  window.runTestCase = async function (caseNumber) {
    const smart = Wow.getSmartDefaultDateTime();
    if (caseNumber === 1) {
      window.switchTab("customer");
      window.askQuestion("Giá gói lắp đặt nhà thông minh cơ bản là bao nhiêu?");
      showToast("Đang chạy TC-01: Truy vấn câu hỏi trong bộ FAQ.");
    } else if (caseNumber === 2) {
      if (runningCases.has(2)) return;
      runningCases.add(2);
      setCaseResult(2, "Đang chọn và kiểm tra giờ hẹn…", "pending");
      try {
        const existing = Storage.getBookings();
        const slot = Wow.getNextAvailableBookingSlot("0912345678", existing);
        const res = Validator.validateBookingForm({ name: "Phạm Nga Thế", phone: "0912345678",
          date: slot.date, time: slot.time, note: "Lịch hẹn mẫu TC-02 — khảo sát gói cơ bản" }, existing);
        if (!res.valid) throw new Error(res.error);
        const added = Storage.addBooking(res.sanitized);
        if (!added.success) throw new Error(added.error || "Không lưu được lịch hẹn.");
        const persisted = Storage.getBookings().find((b) => b.id === added.record.id);
        if (!persisted) throw new Error("Chưa xác nhận được bản ghi trong bộ nhớ.");
        renderAdminBookings();
        window.switchTab("customer");
        appendBotMessage("Đã tạo lịch hẹn mẫu từ ca kiểm thử TC-02:", true, "BOOKING_SYSTEM", null, added.record);
        Wow.playNotificationSound("booking_success");
        setCaseResult(2, "ĐẠT: Đã lưu " + persisted.id + " vào " + persisted.time + " ngày " + persisted.date + "; hiện thẻ xác nhận và danh sách quản lý.", "pass");
        showToast("TC-02: Đã lưu lịch tương lai lúc " + persisted.time + " ngày " + persisted.date + ".");
      } catch (error) {
        setCaseResult(2, "CHƯA ĐẠT: " + error.message, "fail");
        showToast("TC-02 chưa tạo được lịch: " + error.message);
      } finally { runningCases.delete(2); }
    } else if (caseNumber === 3) {
      window.switchTab("customer");
      window.openBookingModal();
      document.getElementById("bookName").value = "Nguyễn Văn B";
      document.getElementById("bookPhone").value = "12345abc";
      document.getElementById("bookDate").value = smart.defaultDate;
      document.getElementById("bookTime").value = "10:00";
      document.getElementById("bookingForm").dispatchEvent(new Event("submit", { cancelable: true }));
      showToast("TC-03 hoàn tất: Đã chặn số điện thoại sai định dạng (12345abc).");
    } else if (caseNumber === 4) {
      window.switchTab("customer");
      window.openBookingModal();
      document.getElementById("bookName").value = "Trần Thị C";
      document.getElementById("bookPhone").value = "0987654321";
      document.getElementById("bookDate").value = "2020-01-01";
      document.getElementById("bookTime").value = "09:00";
      document.getElementById("bookingForm").dispatchEvent(new Event("submit", { cancelable: true }));
      showToast("TC-04 hoàn tất: Đã chặn ngày hẹn trong quá khứ (01/01/2020).");
    } else if (caseNumber === 5) {
      if (runningCases.has(5)) return;
      runningCases.add(5);
      setCaseResult(5, "Đang kiểm tra câu hỏi ngoài phạm vi FAQ…", "pending");
      try {
        window.switchTab("customer");
        const response = await window.askQuestion("Tôi muốn thiết kế riêng hệ thống BMS công nghiệp cho tòa nhà 25 tầng tại Hà Nội thì báo giá sao?");
        if (!response || response.can_answer !== false || response.suggested_questions?.length !== 3) {
          throw new Error("Chưa đáp ứng yêu cầu từ chối ngoài FAQ và đủ 03 gợi ý.");
        }
        setCaseResult(5, "ĐẠT: can_answer=false, không báo giá gói cơ bản; hiện nút đặt lịch và 03 gợi ý. Bấm đặt lịch để xem ghi chú điền sẵn.", "pass");
        showToast("TC-05: Nội dung ngoài FAQ đã được chuyển sang đặt lịch tư vấn.");
      } catch (error) {
        setCaseResult(5, "CHƯA ĐẠT: " + error.message, "fail");
        showToast("TC-05 chưa hoàn tất: " + error.message);
      } finally { runningCases.delete(5); }
    } else if (caseNumber === 6) {
      localStorage.setItem(Storage.STORAGE_KEY, "{corrupted_json_data!!!");
      Storage.getBookings();
      window.switchTab("customer");
      window.askQuestion("Chính sách bảo hành và đổi trả thiết bị như thế nào?", false, true);
      showToast("TC-06 hoàn tất: Tự phục hồi dữ liệu localStorage lỗi & chuyển sang chế độ dự phòng.");
    }
  };

  function showToast(msg) {
    const toast = document.getElementById("toastNotification");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 3500);
  }
})();
