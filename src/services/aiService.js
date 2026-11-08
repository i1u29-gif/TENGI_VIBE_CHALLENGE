/**
 * Gemini integration: validate keys with ListModels and a real generation probe.
 * Display names come from model metadata; local replies are labelled as local.
 */
window.TengiApp = window.TengiApp || {};

window.TengiApp.AIService = {
  DEFAULT_CANDIDATE_MODELS: [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-flash-latest"
  ],
  resolvedModel: null,
  availableModels: [],
  SINGLE_REQUEST_TIMEOUT_MS: 20000,
  lastDiagnostic: "",

  sanitizeApiKey(rawKey) {
    if (!rawKey) return "";
    let cleaned = String(rawKey)
      .trim()
      .replace(/^GEMINI_API_KEY\s*=\s*/i, "")
      .replace(/^["']+|["']+$/g, "")
      .trim();
    const keyMatch = cleaned.match(/AIza[0-9A-Za-z\-_]{30,45}/);
    if (keyMatch) {
      return keyMatch[0];
    }
    return cleaned;
  },

  checkConversationalIntent(userText, faqList) {
    const clean = String(userText || "")
      .toLowerCase()
      .replace(/[!.,?~'"()]/g, "")
      .trim();

    const greetingPatterns = [
      "hi", "hello", "hey", "alo", "chào", "xin chào", "chao", "xin chao",
      "chào shop", "chào bạn", "chào ad", "chào bot", "hi shop", "hi bot",
      "hello shop", "có ai không", "tư vấn giúp mình", "tư vấn", "bắt đầu", "test"
    ];

    const thanksPatterns = [
      "cảm ơn", "cam on", "cám ơn", "thank", "thanks", "thank you", "tks",
      "ok", "oke", "okay", "ok bạn", "ok shop", "tốt quá", "tuyệt vời", "đã hiểu"
    ];

    if (greetingPatterns.includes(clean) || /^(hi+|hello+|hey+|alo+|xin\s+chào|chào\s+bạn|chào\s+shop)$/i.test(clean)) {
      return {
        isConversational: true,
        response: window.TengiApp.Validator.validateAndNormalizeAIOutput(
          {
            answer:
              "Xin chào bạn!  Mình là **Trợ lý AI 24/7 của Tengi SmartHome**. Rất vui được hỗ trợ bạn hôm nay! Mình có thể giải đáp ngay các thông tin về **báo giá gói lắp đặt**, **chính sách bảo hành 24 tháng**, **thời gian thi công** hoặc hỗ trợ **đặt lịch khảo sát miễn phí**. Bạn đang quan tâm đến nội dung nào bên dưới ạ?",
            can_answer: true,
            matched_faq_id: "GREETING",
            suggested_questions: [faqList[1].question, faqList[4].question, faqList[2].question]
          },
          faqList
        )
      };
    }

    if (thanksPatterns.includes(clean)) {
      return {
        isConversational: true,
        response: window.TengiApp.Validator.validateAndNormalizeAIOutput(
          {
            answer:
              "Dạ không có gì ạ! 😊 Rất vui vì thông tin hữu ích với bạn. Nếu cần tìm hiểu thêm về thiết bị nhà thông minh hoặc muốn đặt lịch hẹn với kỹ thuật viên Tengi, bạn cứ chọn các câu hỏi gợi ý bên dưới nhé!",
            can_answer: true,
            matched_faq_id: "THANKS",
            suggested_questions: [faqList[0].question, faqList[3].question, faqList[6].question]
          },
          faqList
        )
      };
    }

    return { isConversational: false, response: null };
  },

  async fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === "AbortError") {
        throw new Error(`Timeout (${timeoutMs / 1000}s)`);
      }
      throw err;
    }
  },

  connection: { status: "local", name: "" },
  modelNames: {},

  resetConnection() {
    this.resolvedModel = null;
    this.availableModels = [];
    this.modelNames = {};
    this.lastDiagnostic = "";
    this.connection = { status: "local", name: "" };
  },

  async apiError(response) {
    let data = {};
    try { data = await response.json(); } catch {}
    const reasons = (data.error?.details || []).map((d) => d.reason || "").join(" ");
    const message = data.error?.message || "";
    let text;
    if (response.status === 401 || /API_KEY_INVALID|API_KEY_EXPIRED|API_KEY_NOT_FOUND/.test(reasons) ||
        /api key (not valid|expired|invalid)/i.test(message)) {
      text = "API không hợp lệ. Vui lòng kiểm tra lại khóa Gemini API.";
    } else if (response.status === 403) {
      text = "API bị từ chối quyền truy cập. Kiểm tra quyền, giới hạn khóa hoặc dịch vụ Gemini của dự án.";
    } else if (response.status === 429) {
      text = "API đã hết hạn mức hoặc gửi quá nhiều yêu cầu. Vui lòng kiểm tra quota và thử lại sau.";
    } else if (response.status >= 500) {
      text = "Dịch vụ AI đang tạm gián đoạn. Vui lòng thử kết nối lại sau.";
    } else if (response.status === 404) {
      text = "Mô hình AI hiện không khả dụng với API này.";
    } else {
      text = "Không thể xác thực kết nối AI (HTTP " + response.status + "). Vui lòng kiểm tra cấu hình API.";
    }
    const error = new Error(text);
    error.status = response.status;
    return error;
  },

  connectionErrorMessage(error) {
    if (error.status || error.userFacing) return error.message;
    return /Timeout|AbortError/i.test(error.message || "")
      ? "Kết nối AI quá thời gian chờ. Vui lòng thử lại."
      : "Không thể kết nối AI. Kiểm tra Internet, quyền truy cập mạng và thử lại.";
  },

  async discoverAvailableModels(rawKey) {
    const apiKey = this.sanitizeApiKey(rawKey);
    const models = [];
    let pageToken = "";
    for (let page = 0; page < 10; page++) {
      const url = new URL("https://generativelanguage.googleapis.com/v1beta/models");
      url.searchParams.set("pageSize", "1000");
      if (pageToken) url.searchParams.set("pageToken", pageToken);
      const res = await this.fetchWithTimeout(url.toString(), {
        headers: { Accept: "application/json", "x-goog-api-key": apiKey }
      }, 12000);
      if (!res.ok) throw await this.apiError(res);
      const data = await res.json();
      models.push(...(data.models || []));
      pageToken = data.nextPageToken || "";
      if (!pageToken) break;
    }
    const supported = models.filter((m) =>
      (m.supportedGenerationMethods || []).includes("generateContent") &&
      /^models\/gemini/i.test(m.name || "") &&
      !/embedding|imagen|tts|audio|robotics|computer-use|veo|aqa|bisheng|image/.test(m.name)
    );
    const score = (m) => /flash/.test(m.name) ? (/preview|exp/.test(m.name) ? 2 : 3) : 1;
    supported.sort((a, b) => score(b) - score(a));
    this.modelNames = Object.fromEntries(supported.map((m) => [m.name.replace(/^models\//, ""), m.displayName || m.name.replace(/^models\//, "")]));
    this.availableModels = supported.map((m) => m.name.replace(/^models\//, ""));
    return this.availableModels;
  },

  // A listing alone does not prove that generateContent is usable.
  async validateConnection(rawKey) {
    const key = this.sanitizeApiKey(rawKey);
    this.resetConnection();
    if (!key || key.length < 10 || /\s/.test(key)) {
      const error = new Error("API không hợp lệ. Vui lòng nhập khóa Gemini API.");
      error.userFacing = true;
      throw error;
    }
    try {
      const models = await this.discoverAvailableModels(key);
      if (!models.length) {
        const error = new Error("API không có mô hình Gemini hỗ trợ trò chuyện khả dụng.");
        error.userFacing = true;
        throw error;
      }
      let lastError;
      for (const model of models.slice(0, 3)) {
        const response = await this.fetchWithTimeout(
          "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent",
          { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Reply only OK." }] }] }) },
          this.SINGLE_REQUEST_TIMEOUT_MS
        );
        if (!response.ok) {
          lastError = await this.apiError(response);
          if ([404, 503].includes(response.status)) continue;
          throw lastError;
        }
        const data = await response.json();
        const hasReply = data.candidates?.some((c) => c.content?.parts?.some((part) => typeof part.text === "string" && part.text.trim()));
        if (!hasReply) {
          lastError = Object.assign(new Error("AI chưa trả về phản hồi kiểm tra hợp lệ. Vui lòng thử lại."), { userFacing: true });
          continue;
        }
        this.resolvedModel = model;
        this.connection = { status: "connected", name: this.modelNames[model] || model };
        return { model, name: this.connection.name };
      }
      throw lastError;
    } catch (error) {
      this.resetConnection();
      throw error;
    }
  },

  buildPrompt(userQuestion, faqList) {
    const knowledgeText = faqList
      .map((f, idx) => `${idx + 1}. [${f.id}] Hỏi: "${f.question}" -> Đáp: "${f.answer}"`)
      .join("\n");

    return `Bạn là Trợ lý ảo CSKH 24/7 của doanh nghiệp "Tengi SmartHome".
Bộ kiến thức FAQ duy nhất:
${knowledgeText}

QUY TẮC KIỂM SOÁT KỊCH BẢN & CHỐNG LẠC ĐỀ (STRICT GUARDRAILS):
1. Nếu khách chào hỏi xã giao ("hi", "hello", "xin chào", "cảm ơn", "ok"), hãy chào lại thân thiện theo kịch bản CSKH Tengi SmartHome và đặt "can_answer": true.
2. Nếu câu hỏi thuộc hoặc liên quan tới bộ 10 câu FAQ ở trên, hãy diễn đạt lại tự nhiên, bám sát 100% số liệu trong FAQ và đặt "can_answer": true.
3. NGHIÊM CẤM TRẢ LỜI LẠC ĐỀ / TỰ DO (Anti-Hallucination): Nếu khách hỏi chuyện phiếm ngoài lề (thời tiết, nấu ăn, bóng đá, toán học, viết văn, lập trình...) hoặc hỏi dịch vụ chuyên sâu không có trong 10 câu FAQ, TUYỆT ĐỐI KHÔNG trả lời nội dung lạc đề đó. Hãy lịch sự giữ đúng vai trò CSKH Tengi SmartHome, thông báo nội dung nằm ngoài kịch bản FAQ tự động và chủ động mời khách bấm nút Đặt lịch tư vấn với nhân viên, đồng thời đặt "can_answer": false.
4. Luôn trả về đúng 03 câu hỏi gợi ý trích từ bộ FAQ trong "suggested_questions".

Chỉ trả về JSON hợp lệ theo mẫu:
{
  "answer": "Câu trả lời tự nhiên...",
  "can_answer": true,
  "matched_faq_id": "FAQ-01",
  "suggested_questions": ["Câu 1?", "Câu 2?", "Câu 3?"]
}

Khách hỏi: "${userQuestion}"`;
  },

  // Bóc tách JSON siêu linh hoạt (Nếu Gemini trả về text thường cũng tự bọc lại thành JSON hợp lệ)
  extractJsonFromText(rawText, faqList) {
    if (!rawText || typeof rawText !== "string") return null;
    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {}
      }
      // Nếu Gemini trả lời bằng văn bản thuần (không phải JSON), vẫn giữ nguyên câu trả lời của Gemini!
      if (cleaned.length > 5) {
        const isOut =
          cleaned.toLowerCase().includes("đặt lịch") &&
          (cleaned.toLowerCase().includes("ngoài phạm vi") || cleaned.toLowerCase().includes("chuyên viên"));
        return {
          answer: cleaned,
          can_answer: !isOut,
          matched_faq_id: null,
          suggested_questions: [faqList[1].question, faqList[4].question, faqList[2].question]
        };
      }
      return null;
    }
  },

  // Payload REST chuẩn 100% theo tài liệu Google AI Studio (Không chứa trường lạ gây lỗi 400)
  async callSingleModel(modelId, promptText, apiKey) {
    const cleanModel = String(modelId || "gemini-2.5-flash")
      .trim()
      .replace(/^models\//, "")
      .replace(/:generateContent$/i, "");

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cleanModel)}:generateContent`;

    const payload = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    let response = await this.fetchWithTimeout(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(payload)
      },
      this.SINGLE_REQUEST_TIMEOUT_MS
    );

    // Nếu model không hỗ trợ responseMimeType (trả về 400), tự động gọi lại chỉ với contents chuẩn
    if (response.status === 400) {
      const minimalPayload = {
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ]
      };
      response = await this.fetchWithTimeout(
        endpoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify(minimalPayload)
        },
        this.SINGLE_REQUEST_TIMEOUT_MS
      );
    }

    return response;
  },

  async generateResponse(userQuestion, faqList, rawApiKey, forceSimulateError = false) {
    // 1. Chỉ khi bấm chạy Ca kiểm thử số 6 (Bảng A) mới trả về nhãn FALLBACK_RECOVERY
    if (forceSimulateError) {
      const fallback = this.localSmartFallback(userQuestion, faqList);
      return {
        ...fallback,
        source: "FALLBACK_RECOVERY",
        notice: "Đã xử lý sự cố kết nối AI (Timeout/Network Error) và chuyển sang bộ xử lý dự phòng an toàn."
      };
    }

    const apiKey = this.sanitizeApiKey(rawApiKey);

    // 2. FAST-PATH cho câu chào hỏi xã giao ("hi", "hello", "xin chào"...)
    const conv = this.checkConversationalIntent(userQuestion, faqList);
    if (conv.isConversational && conv.response) {
      await new Promise((r) => setTimeout(r, 150));
      return {
        ...conv.response,
        source: "LOCAL_NLP_ENGINE",
        modelUsed: this.resolvedModel || "gemini-2.5-flash",
        notice: null
      };
    }

    // Guard before both the live API and fallback: do not substitute a package quote for custom work.
    if (!this.classifyFaqQuestion(userQuestion, faqList)) {
      return { ...this.outsideFaqResponse(userQuestion, faqList), source: "LOCAL_NLP_ENGINE", notice: null };
    }

    // 3. Gọi Gemini API thật
    if (apiKey && apiKey.length > 10) {
      try {
        if (this.availableModels.length === 0) {
          await this.discoverAvailableModels(apiKey);
        }

        // Chỉ thử các model thực sự tồn tại trong tài khoản của bạn (nếu ListModels trả về)
        let modelsToTry = [];
        if (this.availableModels.length > 0) {
          modelsToTry = [...this.availableModels];
        } else {
          modelsToTry = [...this.DEFAULT_CANDIDATE_MODELS];
        }
        if (this.resolvedModel) {
          modelsToTry = [this.resolvedModel, ...modelsToTry.filter((m) => m !== this.resolvedModel)];
        }

        const promptText = this.buildPrompt(userQuestion, faqList);

        for (const candidateModel of modelsToTry.slice(0, 5)) {
          try {
            const response = await this.callSingleModel(candidateModel, promptText, apiKey);

            if (!response.ok) {
              const error = await this.apiError(response);
              this.lastDiagnostic = error.message;
              if ([400, 401, 403, 429].includes(response.status)) break;
              continue;
            }

            const data = await response.json();
            const rawText = (data?.candidates?.[0]?.content?.parts || [])
              .filter((part) => !part.thought && typeof part.text === "string")
              .map((part) => part.text).join("\n");
            const parsed = this.extractJsonFromText(rawText, faqList);
            const validated = window.TengiApp.Validator.validateAndNormalizeAIOutput(parsed, faqList);

            if (validated) {
              this.resolvedModel = candidateModel;
              this.connection = { status: "connected", name: this.modelNames[candidateModel] || candidateModel };
              return {
                ...validated,
                matched_faq_id: parsed.matched_faq_id || null,
                source: "GEMINI_API_REAL",
                modelUsed: candidateModel,
                notice: null
              };
            }
          } catch (innerErr) {
            this.lastDiagnostic = this.connectionErrorMessage(innerErr);
            continue;
          }
        }
      } catch (err) {
        this.lastDiagnostic = this.connectionErrorMessage(err);
      }

      // Keep local recovery distinct from a successful AI response.
      this.connection.status = "interrupted";
      const fallback = this.localSmartFallback(userQuestion, faqList);
      return {
        ...fallback,
        source: "FALLBACK_RECOVERY",
        modelUsed: null,
        notice: (this.lastDiagnostic || "AI chưa trả về phản hồi hợp lệ.") + " Hệ thống đang trả lời bằng dữ liệu kịch bản nội bộ."
      };
    }

    // 4. Khi chưa nhập API Key -> Chạy Engine NLP nội bộ
    await new Promise((r) => setTimeout(r, 220));
    const localResult = this.localSmartFallback(userQuestion, faqList);
    return {
      ...localResult,
      source: "LOCAL_NLP_ENGINE",
      notice: null
    };
  },

  normalizeQuestion(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase()
      .replace(/[^a-z0-9]+/g, " ").trim();
  },

  classifyFaqQuestion(userText, faqList) {
    const q = this.normalizeQuestion(userText);
    const exact = faqList.find((item) => this.normalizeQuestion(item.question) === q);
    if (exact) return exact;
    // Requests needing knowledge or a quotation beyond the supplied FAQ require a human.
    const specialized = /\b(bms|scada|plc|cong nghiep|nha may|nha xuong|benh vien|khach san|trung tam thuong mai|thiet ke rieng|thiet ke chi tiet|lap trinh|so do dau day|tinh toan cong suat|du toan chi tiet|bao gia rieng|bao gia chi tiet)\b/;
    if (specialized.test(q) || /\btoa nha\s+\d+\s+tang\b/.test(q)) return null;
    // Match topic phrases rather than arbitrary single-word substring overlap.
    const rules = [
      ["FAQ-01", /\b(gio lam viec|mo cua|dia chi|showroom|o dau|van phong|chi nhanh|may gio)\b/],
      ["FAQ-03", /\b(bao hanh|doi tra|sua chua|bao tri|1 doi 1)\b/],
      ["FAQ-04", /\b(thoi gian thi cong|thoi gian lap dat|thi cong|lap mat may ngay|lap dat mat bao lau|lap dat bao lau|tien do)\b/],
      ["FAQ-05", /\b(khao sat|tu van tai nha|demo tai nha|ho tro tan noi)\b/],
      ["FAQ-06", /\b(mat mang|mat wifi|mat internet|wi fi|wifi|internet|offline|mat ket noi|rot mang|dut cap)\b/],
      ["FAQ-07", /\b(tra gop|thanh toan|chuyen khoan|the tin dung|lai suat|tra truoc|quet the)\b/],
      ["FAQ-08", /\b(ung dung|app|ios|android|giong noi|google home|siri|apple homekit|alexa|dieu khien qua dien thoai)\b/],
      ["FAQ-09", /\b(nha cu|dang o|moi xay|duc tuong|thay cong tac|cai tao|di lai day)\b/],
      ["FAQ-10", /\b(camera|khoa van tay|chong trom|an ninh|canh bao|bao dong|dot nhap|coi hu)\b/]
    ];
    for (const [id, pattern] of rules) if (pattern.test(q)) return faqList.find((f) => f.id === id) || null;
    const pricing = /\b(gia|chi phi|bao nhieu tien|goi co ban)\b/.test(q);
    const productContext = /\b(goi co ban|goi lap dat|nha thong minh|smarthome|can ho|lap dat)\b/.test(q);
    const shortPricing = /^(bao gia|gia bao nhieu|chi phi bao nhieu|gia goi co ban|goi co ban gia bao nhieu)( a| nhe| vay)?$/.test(q);
    if (pricing && (productContext || shortPricing)) return faqList.find((f) => f.id === "FAQ-02") || null;
    return null;
  },

  outsideFaqResponse(userText, faqList) {
    return {
      ...window.TengiApp.Validator.validateAndNormalizeAIOutput({
        answer: "Nội dung bạn hỏi cần tư vấn riêng hoặc chưa có trong bộ thông tin FAQ của Tengi. Mình chưa có đủ dữ liệu để đưa ra câu trả lời hay báo giá chính xác. Bạn có thể **đặt lịch tư vấn với chuyên viên kỹ thuật** để được hỗ trợ theo nhu cầu thực tế.",
        can_answer: false,
        suggested_questions: [faqList[1].question, faqList[4].question, faqList[3].question]
      }, faqList),
      matched_faq_id: null
    };
  },

  localSmartFallback(userText, faqList) {
    const conv = this.checkConversationalIntent(userText, faqList);
    if (conv.isConversational && conv.response) {
      return conv.response;
    }

    const bestMatch = this.classifyFaqQuestion(userText, faqList);
    if (bestMatch) {
      const intros = [
        "Dạ chào bạn, về thắc mắc này Tengi SmartHome xin giải đáp chi tiết như sau: ",
        "Cảm ơn bạn đã quan tâm! Mình xin gửi thông tin chính xác tới bạn nhé: ",
        "Dạ rất sẵn lòng hỗ trợ bạn! Theo chính sách hiện hành của Tengi: "
      ];
      const intro = intros[userText.length % intros.length];
      const relatedQuestions = bestMatch.relatedIds
        .map((id) => faqList.find((f) => f.id === id)?.question)
        .filter(Boolean);

      return window.TengiApp.Validator.validateAndNormalizeAIOutput(
        {
          answer: `${intro}${bestMatch.answer} Bạn có muốn tìm hiểu thêm các thông tin liên quan bên dưới không ạ?`,
          can_answer: true,
          matched_faq_id: bestMatch.id,
          suggested_questions: relatedQuestions
        },
        faqList
      );
    }

    return this.outsideFaqResponse(userText, faqList);
  }
};
