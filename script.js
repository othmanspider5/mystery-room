"use strict";

// ======================================
// THE MYSTERY ROOM
// ======================================

const $ = id => document.getElementById(id);

let language = "en";
let score = 0;
let solved = 0;
let currentRiddle = 0;
let riddleAnswered = false;
let currentCase = null;
let archiveUnlocked = false;

const solvedCases = new Set();
const solvedRiddles = new Set();


// ======================================
// LANGUAGE HELPER
// ======================================

function tr(value) {
  if (!value || typeof value !== "object") {
    return "";
  }

  return value[language] ?? "";
}

function makeElement(tag, className, content) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (content !== undefined) {
    element.textContent = content;
  }

  return element;
}


// ======================================
// POLICE CASE DATABASE
// ======================================

const cases = {

  compass: {
    id: "TMR-2026-001",

    title: {
      en: "THE MISSING COMPASS",
      ar: "البوصلة المفقودة"
    },

    story: {
      en: "At 19:00, museum staff reported that an antique compass had disappeared from Display Cabinet 04. The gallery had been open to visitors earlier that evening. The police unit secured the room, requested the access register and collected statements from three people who were present. The available records show a difference between one statement and the official timeline. Your task is to identify whose account needs further questioning. The available evidence does not, by itself, prove who took the compass.",

      ar: "في الساعة 19:00، أبلغ موظفو المتحف عن اختفاء بوصلة أثرية من خزانة العرض رقم 04. كانت القاعة مفتوحة للزوار في وقت سابق من المساء. قامت وحدة الشرطة بتأمين الغرفة وطلب سجل الدخول وجمع تصريحات ثلاثة أشخاص كانوا موجودين. تُظهر السجلات المتوفرة اختلافاً بين أحد التصريحات والتسلسل الزمني الرسمي. مهمتك هي تحديد الشخص الذي يحتاج إلى استجواب إضافي. الأدلة المتوفرة لا تثبت وحدها من أخذ البوصلة."
    },

    scene: [
      {
        label: { en: "LOCATION", ar: "الموقع" },
        value: { en: "Museum — Gallery A", ar: "المتحف — القاعة A" }
      },
      {
        label: { en: "MISSING ITEM", ar: "الغرض المفقود" },
        value: { en: "Antique compass — Display 04", ar: "بوصلة أثرية — العرض 04" }
      },
      {
        label: { en: "REPORT TIME", ar: "وقت البلاغ" },
        value: { en: "19:00", ar: "19:00" }
      }
    ],

    timeline: [
      {
        time: "18:00",
        text: {
          en: "Museum Gallery A opens to visitors.",
          ar: "فُتحت قاعة المتحف A أمام الزوار."
        }
      },
      {
        time: "18:20",
        text: {
          en: "Supervisor records the compass inside Display 04.",
          ar: "سجل المسؤول وجود البوصلة داخل العرض 04."
        }
      },
      {
        time: "18:32",
        text: {
          en: "Access system records Adam entering the staff corridor.",
          ar: "سجل نظام الدخول دخول آدم إلى ممر الموظفين."
        }
      },
      {
        time: "18:37",
        text: {
          en: "Staff access record shows Adam entering Gallery A.",
          ar: "يُظهر سجل الموظفين دخول آدم إلى القاعة A."
        }
      },
      {
        time: "18:41",
        text: {
          en: "System records Adam leaving Gallery A.",
          ar: "سجل النظام خروج آدم من القاعة A."
        }
      },
      {
        time: "19:00",
        text: {
          en: "Staff report the compass missing.",
          ar: "أبلغ الموظفون عن اختفاء البوصلة."
        }
      }
    ],

    evidence: [
      {
        code: "E-01",
        text: {
          en: "Access log: Adam entered Gallery A at 18:37 and left at 18:41.",
          ar: "سجل الدخول: دخل آدم القاعة A في 18:37 وغادرها في 18:41."
        }
      },
      {
        code: "E-02",
        text: {
          en: "Inventory check confirms the compass was present at 18:20.",
          ar: "فحص الجرد يؤكد أن البوصلة كانت موجودة في 18:20."
        }
      },
      {
        code: "E-03",
        text: {
          en: "No visible damage was recorded on the display cabinet.",
          ar: "لم يتم تسجيل أي تلف ظاهر في خزانة العرض."
        }
      }
    ],

    records: [
      {
        title: { en: "ACCESS CONTROL", ar: "نظام الدخول" },
        text: {
          en: "Adam's staff card was used for Gallery A at 18:37.",
          ar: "استُعملت بطاقة آدم الخاصة بالموظفين لدخول القاعة A في 18:37."
        }
      },
      {
        title: { en: "CAMERA REVIEW", ar: "مراجعة الكاميرات" },
        text: {
          en: "Corridor camera confirms movement toward Gallery A, but does not clearly show what happened inside.",
          ar: "تؤكد كاميرا الممر وجود حركة باتجاه القاعة A، لكنها لا تُظهر بوضوح ما حدث داخلها."
        }
      },
      {
        title: { en: "INVENTORY", ar: "سجل الجرد" },
        text: {
          en: "The last confirmed inventory check was completed at 18:20.",
          ar: "آخر فحص مؤكد للجرد تم في 18:20."
        }
      }
    ],

    witnesses: [
      {
        name: { en: "Adam", ar: "آدم" },
        role: { en: "Gallery assistant", ar: "مساعد القاعة" },
        statement: {
          en: "I did not enter Gallery A after 18:00. I stayed near the front desk.",
          ar: "لم أدخل القاعة A بعد الساعة 18:00. بقيت بالقرب من مكتب الاستقبال."
        }
      },
      {
        name: { en: "Nora", ar: "نورا" },
        role: { en: "Museum visitor", ar: "زائرة في المتحف" },
        statement: {
          en: "I left the museum before 18:30.",
          ar: "غادرت المتحف قبل الساعة 18:30."
        }
      },
      {
        name: { en: "Sami", ar: "سامي" },
        role: { en: "Museum guide", ar: "مرشد المتحف" },
        statement: {
          en: "I was helping visitors in the entrance hall.",
          ar: "كنت أساعد الزوار في قاعة المدخل."
        }
      }
    ],

    question: {
      en: "Whose statement directly conflicts with the staff access record?",
      ar: "تصريح من يتعارض مباشرة مع سجل دخول الموظفين؟"
    },

    options: [
      { en: "Adam", ar: "آدم" },
      { en: "Nora", ar: "نورا" },
      { en: "Sami", ar: "سامي" }
    ],

    answer: 0,

    explanation: {
      en: "The access system records Adam entering Gallery A at 18:37, but he says he did not enter it after 18:00. His statement conflicts with the official record, so he should be interviewed again. This inconsistency is a lead for further investigation, not proof of theft.",

      ar: "يسجل نظام الدخول دخول آدم إلى القاعة A في 18:37، لكنه يقول إنه لم يدخلها بعد 18:00. تصريحه يتعارض مع السجل الرسمي، لذلك ينبغي استجوابه مرة أخرى. هذا التناقض خيط لمواصلة التحقيق وليس دليلاً على السرقة."
    }
  },


  archive: {
    id: "TMR-2026-002",

    title: {
      en: "THE ARCHIVE REPORT",
      ar: "تقرير الأرشيف"
    },

    story: {
      en: "At 16:30, an employee reported that a historical report was missing from Records Room 02. The room uses an electronic visitor register. Police staff collected the access log, inventory sheet and statements from three people. One person stated that they had never entered the room that afternoon. The access log may confirm or contradict that statement.",

      ar: "في الساعة 16:30، أبلغ موظف عن اختفاء تقرير تاريخي من غرفة السجلات رقم 02. تستعمل الغرفة سجلاً إلكترونياً للزوار. جمع فريق الشرطة سجل الدخول وقائمة الجرد وتصريحات ثلاثة أشخاص. قال أحد الأشخاص إنه لم يدخل الغرفة إطلاقاً بعد ظهر ذلك اليوم. قد يؤكد سجل الدخول هذا التصريح أو يناقضه."
    },

    scene: [
      {
        label: { en: "LOCATION", ar: "الموقع" },
        value: { en: "Records Building — Room 02", ar: "مبنى السجلات — الغرفة 02" }
      },
      {
        label: { en: "MISSING ITEM", ar: "الغرض المفقود" },
        value: { en: "Historical report — Folder H17", ar: "تقرير تاريخي — الملف H17" }
      },
      {
        label: { en: "REPORT TIME", ar: "وقت البلاغ" },
        value: { en: "16:30", ar: "16:30" }
      }
    ],

    timeline: [
      {
        time: "15:30",
        text: {
          en: "Records Room 02 opens for scheduled work.",
          ar: "فُتحت غرفة السجلات 02 للعمل المبرمج."
        }
      },
      {
        time: "15:42",
        text: {
          en: "Electronic register records Omar entering the room.",
          ar: "يسجل النظام الإلكتروني دخول عمر إلى الغرفة."
        }
      },
      {
        time: "15:55",
        text: {
          en: "Clerk confirms Folder H17 on the reading table.",
          ar: "يؤكد الموظف وجود الملف H17 على طاولة القراءة."
        }
      },
      {
        time: "16:10",
        text: {
          en: "Register records Omar leaving the room.",
          ar: "يسجل النظام مغادرة عمر للغرفة."
        }
      },
      {
        time: "16:30",
        text: {
          en: "Missing report is officially reported.",
          ar: "تم التبليغ رسمياً عن اختفاء التقرير."
        }
      }
    ],

    evidence: [
      {
        code: "E-01",
        text: {
          en: "Electronic access record: Omar entered at 15:42.",
          ar: "سجل الدخول الإلكتروني: دخل عمر في 15:42."
        }
      },
      {
        code: "E-02",
        text: {
          en: "Electronic exit record: Omar left at 16:10.",
          ar: "سجل الخروج الإلكتروني: غادر عمر في 16:10."
        }
      },
      {
        code: "E-03",
        text: {
          en: "Clerk's inventory: Folder H17 was present at 15:55.",
          ar: "جرد الموظف: كان الملف H17 موجوداً في 15:55."
        }
      }
    ],

    records: [
      {
        title: { en: "DOOR ACCESS LOG", ar: "سجل دخول الباب" },
        text: {
          en: "Omar's access card was recorded at 15:42.",
          ar: "تم تسجيل بطاقة دخول عمر في 15:42."
        }
      },
      {
        title: { en: "EXIT REGISTER", ar: "سجل المغادرة" },
        text: {
          en: "The same card was recorded leaving at 16:10.",
          ar: "تم تسجيل البطاقة نفسها عند المغادرة في 16:10."
        }
      },
      {
        title: { en: "INVENTORY SHEET", ar: "ورقة الجرد" },
        text: {
          en: "The report was checked before the recorded exit.",
          ar: "تم فحص التقرير قبل تسجيل المغادرة."
        }
      }
    ],

    witnesses: [
      {
        name: { en: "Omar", ar: "عمر" },
        role: { en: "Research visitor", ar: "زائر باحث" },
        statement: {
          en: "I never entered Records Room 02 that afternoon.",
          ar: "لم أدخل غرفة السجلات 02 إطلاقاً بعد ظهر ذلك اليوم."
        }
      },
      {
        name: { en: "Maya", ar: "مايا" },
        role: { en: "Records clerk", ar: "موظفة السجلات" },
        statement: {
          en: "I checked the folder during my scheduled inventory.",
          ar: "فحصت الملف أثناء عملية الجرد المبرمجة."
        }
      },
      {
        name: { en: "Yassine", ar: "ياسين" },
        role: { en: "Library assistant", ar: "مساعد المكتبة" },
        statement: {
          en: "I was working in the library next door.",
          ar: "كنت أعمل في المكتبة المجاورة."
        }
      }
    ],

    question: {
      en: "Whose statement conflicts with the electronic access and exit records?",
      ar: "تصريح من يتعارض مع سجلات الدخول والخروج الإلكترونية؟"
    },

    options: [
      { en: "Maya", ar: "مايا" },
      { en: "Omar", ar: "عمر" },
      { en: "Yassine", ar: "ياسين" }
    ],

    answer: 1,

    explanation: {
      en: "The electronic register records Omar entering at 15:42 and leaving at 16:10. He stated that he never entered the room. His account conflicts with two official records and needs further checking. The records do not establish that he took the report.",

      ar: "يسجل النظام الإلكتروني دخول عمر في 15:42 ومغادرته في 16:10. لكنه صرح بأنه لم يدخل الغرفة. يتعارض كلامه مع سجلين رسميين ويحتاج إلى فحص إضافي. هذه السجلات لا تثبت أنه أخذ التقرير."
    }
  },


  studio: {
    id: "TMR-2026-003",

    title: {
      en: "THE STUDIO CAMERA",
      ar: "كاميرا الاستوديو"
    },

    story: {
      en: "At 18:00, a photography studio manager reported that a professional camera was missing from Equipment Cabinet 03. The studio keeps an equipment register and an electronic corridor access system. Three people were interviewed. Compare the recorded movements with each person's statement before deciding who needs another interview.",

      ar: "في الساعة 18:00، أبلغ مدير استوديو للتصوير عن اختفاء كاميرا احترافية من خزانة المعدات رقم 03. يحتفظ الاستوديو بسجل للمعدات ونظام إلكتروني لتسجيل الدخول إلى الممر. تم الاستماع إلى ثلاثة أشخاص. قارن الحركات المسجلة بتصريحات كل شخص قبل تحديد من يحتاج إلى استجواب آخر."
    },

    scene: [
      {
        label: { en: "LOCATION", ar: "الموقع" },
        value: { en: "Photography Studio — Room 03", ar: "استوديو التصوير — الغرفة 03" }
      },
      {
        label: { en: "MISSING ITEM", ar: "الغرض المفقود" },
        value: { en: "Professional camera — Equipment C03", ar: "كاميرا احترافية — المعدة C03" }
      },
      {
        label: { en: "REPORT TIME", ar: "وقت البلاغ" },
        value: { en: "18:00", ar: "18:00" }
      }
    ],

    timeline: [
      {
        time: "17:00",
        text: {
          en: "Camera is confirmed inside Cabinet 03.",
          ar: "تم التأكد من وجود الكاميرا داخل الخزانة 03."
        }
      },
      {
        time: "17:20",
        text: {
          en: "Assistant completes equipment checklist.",
          ar: "أكملت المساعدة قائمة فحص المعدات."
        }
      },
      {
        time: "17:35",
        text: {
          en: "Access system records Salma leaving the studio area.",
          ar: "يسجل نظام الدخول مغادرة سلمى لمنطقة الاستوديو."
        }
      },
      {
        time: "17:50",
        text: {
          en: "Studio manager checks Cabinet 03.",
          ar: "قام مدير الاستوديو بفحص الخزانة 03."
        }
      },
      {
        time: "18:00",
        text: {
          en: "Missing camera is reported.",
          ar: "تم الإبلاغ عن اختفاء الكاميرا."
        }
      }
    ],

    evidence: [
      {
        code: "E-01",
        text: {
          en: "Equipment checklist: camera present at 17:20.",
          ar: "قائمة المعدات: الكاميرا كانت موجودة في 17:20."
        }
      },
      {
        code: "E-02",
        text: {
          en: "Access log: Salma left the studio area at 17:35.",
          ar: "سجل الدخول: غادرت سلمى منطقة الاستوديو في 17:35."
        }
      },
      {
        code: "E-03",
        text: {
          en: "Cabinet check at 17:50 did not locate the camera.",
          ar: "فحص الخزانة في 17:50 لم يعثر على الكاميرا."
        }
      }
    ],

    records: [
      {
        title: { en: "EQUIPMENT REGISTER", ar: "سجل المعدات" },
        text: {
          en: "The camera was checked and listed at 17:20.",
          ar: "تم فحص الكاميرا وتسجيلها في 17:20."
        }
      },
      {
        title: { en: "CORRIDOR ACCESS", ar: "سجل الممر" },
        text: {
          en: "Salma's staff card recorded an exit at 17:35.",
          ar: "سجلت بطاقة سلمى خروجاً في 17:35."
        }
      },
      {
        title: { en: "CAMERA REVIEW", ar: "مراجعة الكاميرات" },
        text: {
          en: "Corridor footage shows movement toward the exit. The item carried cannot be identified clearly.",
          ar: "تُظهر كاميرا الممر حركة باتجاه الخروج. لا يمكن تحديد الغرض المحمول بوضوح."
        }
      }
    ],

    witnesses: [
      {
        name: { en: "Salma", ar: "سلمى" },
        role: { en: "Studio assistant", ar: "مساعدة الاستوديو" },
        statement: {
          en: "I stayed inside the studio area for the entire afternoon.",
          ar: "بقيت داخل منطقة الاستوديو طوال فترة بعد الظهر."
        }
      },
      {
        name: { en: "Karim", ar: "كريم" },
        role: { en: "Studio manager", ar: "مدير الاستوديو" },
        statement: {
          en: "I checked the equipment cabinet at 17:50.",
          ar: "فحصت خزانة المعدات في الساعة 17:50."
        }
      },
      {
        name: { en: "Nabil", ar: "نبيل" },
        role: { en: "Photographer", ar: "مصور" },
        statement: {
          en: "I completed my session and left before 17:30.",
          ar: "أنهيت جلستي وغادرت قبل الساعة 17:30."
        }
      }
    ],

    question: {
      en: "Whose statement conflicts with the official corridor access log?",
      ar: "تصريح من يتعارض مع سجل الدخول الرسمي للممر؟"
    },

    options: [
      { en: "Karim", ar: "كريم" },
      { en: "Salma", ar: "سلمى" },
      { en: "Nabil", ar: "نبيل" }
    ],

    answer: 1,

    explanation: {
      en: "The corridor access system records Salma leaving the studio area at 17:35, while she says she stayed inside the whole afternoon. Her statement needs another interview. The record does not prove that she took the camera.",

      ar: "يسجل نظام الممر مغادرة سلمى لمنطقة الاستوديو في 17:35، بينما تقول إنها بقيت داخله طوال فترة بعد الظهر. لذلك تحتاج إلى استجواب إضافي. السجل لا يثبت أنها أخذت الكاميرا."
    }
  }
};


// ======================================
// RIDDLES DATABASE
// ======================================

const riddles = [
  {
    question: {
      en: "A mysterious object sits silently in a room. It has many keys, but none can open a door. People use it to create beautiful sounds. It has black and white parts, and musicians use it to play hundreds of melodies. What is it?",
      ar: "يوجد شيء غامض داخل غرفة هادئة. يمتلك العديد من المفاتيح، لكن لا يستطيع أي مفتاح منها فتح باب. يستعمله الناس لصناعة ألحان جميلة. يحتوي على أجزاء سوداء وبيضاء، ويستعمله الموسيقيون لعزف مئات الألحان. ما هو؟"
    },

    options: [
      { en: "A piano", ar: "بيانو" },
      { en: "A door", ar: "باب" },
      { en: "A computer mouse", ar: "فأرة الحاسوب" },
      { en: "A clock", ar: "ساعة" }
    ],

    answer: 0,

    hint: {
      en: "Think about music and musical keys.",
      ar: "فكر في الموسيقى والمفاتيح الموسيقية."
    },

    explanation: {
      en: "A piano has musical keys used to create sounds and melodies.",
      ar: "البيانو يحتوي على مفاتيح موسيقية تُستعمل لإنتاج الأصوات والألحان."
    }
  },

  {
    question: {
      en: "A detective walks through an empty forest. Every time he takes another step forward, something is left behind him. The more steps he takes, the more of these marks appear on the ground. They may slowly disappear when the weather changes. What is he leaving behind?",
      ar: "كان محقق يمشي داخل غابة فارغة. كلما تقدم خطوة إلى الأمام، ترك شيئاً وراءه. وكلما زاد عدد خطواته، ظهرت آثار أكثر على الأرض. وقد تختفي هذه الآثار تدريجياً عندما يتغير الطقس. ما الشيء الذي يتركه وراءه؟"
    },

    options: [
      { en: "Coins", ar: "عملات" },
      { en: "Footprints", ar: "آثار الأقدام" },
      { en: "Books", ar: "كتب" },
      { en: "Keys", ar: "مفاتيح" }
    ],

    answer: 1,

    hint: {
      en: "Think about what shoes leave on the ground.",
      ar: "فكر فيما تتركه الأحذية على الأرض."
    },

    explanation: {
      en: "Every step can leave a footprint behind.",
      ar: "كل خطوة يمكن أن تترك أثراً للقدم على الأرض."
    }
  },

  {
    question: {
      en: "Inside an old detective's office, there is a tiny object that has one eye but cannot see anything. It is used by people who repair clothes and create new ones. A thin thread passes through its eye, helping people join pieces of fabric together. What is it?",
      ar: "داخل مكتب محقق قديم، يوجد جسم صغير له عين واحدة لكنه لا يستطيع رؤية أي شيء. يستعمله الأشخاص الذين يصلحون الملابس ويصنعون ملابس جديدة. يمر خيط رفيع من عينه، ويساعد على ربط قطع القماش ببعضها. ما هو؟"
    },

    options: [
      { en: "A camera", ar: "كاميرا" },
      { en: "A needle", ar: "إبرة" },
      { en: "A cat", ar: "قطة" },
      { en: "A telescope", ar: "منظار" }
    ],

    answer: 1,

    hint: {
      en: "It is commonly used in sewing.",
      ar: "تُستعمل غالباً في الخياطة."
    },

    explanation: {
      en: "A needle has a small opening called an eye where the thread passes.",
      ar: "الإبرة تحتوي على ثقب صغير يسمى عين الإبرة ويمر منه الخيط."
    }
  },

  {
    question: {
      en: "A detective enters a bathroom and sees water everywhere. Next to the sink, there is an object that becomes increasingly wet while doing its job. People use it after washing their hands or taking a shower. It removes water from another surface by absorbing it. What is it?",
      ar: "دخل محقق إلى الحمام ولاحظ وجود الماء في كل مكان. بجانب المغسلة يوجد شيء يصبح أكثر بللاً أثناء قيامه بعمله. يستعمله الناس بعد غسل أيديهم أو الاستحمام. مهمته إزالة الماء من سطح آخر عن طريق امتصاصه. ما هو؟"
    },

    options: [
      { en: "A towel", ar: "منشفة" },
      { en: "A mirror", ar: "مرآة" },
      { en: "A lamp", ar: "مصباح" },
      { en: "A chair", ar: "كرسي" }
    ],

    answer: 0,

    hint: {
      en: "You probably use it after a shower.",
      ar: "غالباً ما تستعمله بعد الاستحمام."
    },

    explanation: {
      en: "A towel absorbs water while drying another object or person.",
      ar: "المنشفة تمتص الماء أثناء تجفيف شيء آخر أو شخص."
    }
  },

  {
    question: {
      en: "A traveller stands between two enormous mountains. He shouts into the distance, but nobody is standing nearby. A few moments later, he hears the same sound returning to him. It seems that the mountains are answering, even though they have no mouth. What produces this strange sound?",
      ar: "وقف مسافر بين جبلين كبيرين. صرخ نحو المسافة البعيدة، لكن لم يكن هناك أي شخص قريب منه. بعد لحظات، سمع الصوت نفسه يعود إليه. بدا وكأن الجبال تجيبه، رغم أنها لا تمتلك فماً. ما الذي يصدر هذا الصوت الغريب؟"
    },

    options: [
      { en: "A radio", ar: "راديو" },
      { en: "An echo", ar: "صدى" },
      { en: "A bird", ar: "طائر" },
      { en: "A telephone", ar: "هاتف" }
    ],

    answer: 1,

    hint: {
      en: "It repeats a sound after you speak.",
      ar: "يعيد الصوت بعد أن تتكلم."
    },

    explanation: {
      en: "An echo is the reflection of sound from a distant surface.",
      ar: "الصدى هو انعكاس الصوت عن سطح بعيد وعودته إلى المستمع."
    }
  }
];


// ======================================
// SCORE SYSTEM
// ======================================

function updateStats() {
  $("score").textContent = score;
  $("solved").textContent = solved;

  const level = Math.min(
    Math.floor(score / 30) + 1,
    10
  );

  $("level").textContent = String(level).padStart(2, "0");
}


// ======================================
// POLICE CASE RENDERER
// ======================================

function renderCase(caseId) {
  const data = cases[caseId];

  if (!data) {
    console.error("Unknown case:", caseId);
    return;
  }

  currentCase = caseId;

  $("investigationTitle").textContent = tr(data.title);
  $("investigationId").textContent = data.id;
  $("caseStory").textContent = tr(data.story);
  $("caseQuestion").textContent = tr(data.question);

  // Crime scene
  const scene = $("sceneDetails");
  scene.replaceChildren();

  data.scene.forEach(item => {
    const card = makeElement("div", "scene-item");

    card.append(
      makeElement("strong", "", tr(item.label)),
      makeElement("p", "", tr(item.value))
    );

    scene.appendChild(card);
  });

  // Timeline
  const timeline = $("timelineList");
  timeline.replaceChildren();

  data.timeline.forEach(item => {
    const row = makeElement("div", "timeline-item");

    row.append(
      makeElement("span", "timeline-time", item.time),
      makeElement("span", "timeline-text", tr(item.text))
    );

    timeline.appendChild(row);
  });

  // Evidence
  const evidence = $("evidenceList");
  evidence.replaceChildren();

  data.evidence.forEach(item => {
    const row = makeElement("div", "evidence-item");

    row.append(
      makeElement("span", "evidence-number", item.code),
      makeElement("p", "", tr(item.text))
    );

    evidence.appendChild(row);
  });

  // Official records
  const records = $("recordsList");
  records.replaceChildren();

  data.records.forEach(item => {
    const row = makeElement("div", "record-item");

    row.append(
      makeElement("strong", "", tr(item.title)),
      makeElement("p", "", tr(item.text))
    );

    records.appendChild(row);
  });

  // Witness interviews
  const witnesses = $("suspectList");
  witnesses.replaceChildren();

  data.witnesses.forEach((person, index) => {
    const card = makeElement("article", "suspect-card");

    card.append(
      makeElement(
        "span",
        "suspect-id",
        `${language === "en" ? "INTERVIEW" : "استجواب"} 0${index + 1}`
      ),
      makeElement("h4", "", tr(person.name)),
      makeElement("div", "suspect-role", tr(person.role)),
      makeElement("p", "", `“${tr(person.statement)}”`)
    );

    witnesses.appendChild(card);
  });

  // Detective answer choices
  const options = $("caseOptions");
  options.replaceChildren();

  data.options.forEach((option, index) => {
    const button = makeElement("button", "answer-btn", tr(option));

    button.type = "button";

    button.addEventListener("click", () => {
      checkCaseAnswer(index);
    });

    options.appendChild(button);
  });

  $("caseFeedback").textContent = "";
  $("caseFeedback").className = "feedback";

  $("investigationPanel").classList.remove("hidden");

  requestAnimationFrame(() => {
    $("investigationPanel").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}


// ======================================
// OPEN / CLOSE POLICE FILES
// ======================================

document.querySelectorAll(".case-btn").forEach(button => {
  button.addEventListener("click", () => {
    renderCase(button.dataset.case);
  });
});

$("closeInvestigation").addEventListener("click", () => {
  $("investigationPanel").classList.add("hidden");
  currentCase = null;
});


// ======================================
// CASE ANSWER CHECKER
// ======================================

function checkCaseAnswer(selected) {
  if (!currentCase) return;

  const data = cases[currentCase];

  const buttons = [
    ...$("caseOptions").querySelectorAll("button")
  ];

  if (buttons.some(button => button.disabled)) {
    return;
  }

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === data.answer) {
      button.classList.add("correct");
    }

    if (index === selected && selected !== data.answer) {
      button.classList.add("wrong");
    }
  });

  if (selected === data.answer) {
    if (!solvedCases.has(currentCase)) {
      solvedCases.add(currentCase);
      score += 20;
      solved++;
    }

    $("caseFeedback").textContent =
      (language === "en"
        ? "CORRECT ANALYSIS. +20 POINTS. "
        : "تحليل صحيح. +20 نقطة. ") +
      tr(data.explanation);

    $("caseFeedback").className = "feedback good";

  } else {
    $("caseFeedback").textContent =
      language === "en"
        ? "Not correct. Review the official timeline and compare it with the witness statements."
        : "الإجابة غير صحيحة. راجع التسلسل الزمني الرسمي وقارنه بأقوال الشهود.";

    $("caseFeedback").className = "feedback bad";
  }

  updateStats();
}


// ======================================
// RIDDLE SYSTEM
// ======================================

function renderRiddle() {
  const riddle = riddles[currentRiddle];

  $("question").textContent = tr(riddle.question);

  $("riddleNumber").textContent =
    `${String(currentRiddle + 1).padStart(2, "0")} / ${String(riddles.length).padStart(2, "0")}`;

  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("hintText").textContent = "";
  $("nextBtn").disabled = true;

  riddleAnswered = false;

  const answers = $("answers");
  answers.replaceChildren();

  riddle.options.forEach((option, index) => {
    const button = makeElement(
      "button",
      "answer-btn",
      `${String.fromCharCode(65 + index)}. ${tr(option)}`
    );

    button.type = "button";

    button.addEventListener("click", () => {
      checkRiddle(index);
    });

    answers.appendChild(button);
  });
}

function checkRiddle(selected) {
  if (riddleAnswered) return;

  riddleAnswered = true;

  const riddle = riddles[currentRiddle];

  const buttons = [
    ...$("answers").querySelectorAll("button")
  ];

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === riddle.answer) {
      button.classList.add("correct");
    }

    if (index === selected && selected !== riddle.answer) {
      button.classList.add("wrong");
    }
  });

  if (selected === riddle.answer) {
    if (!solvedRiddles.has(currentRiddle)) {
      solvedRiddles.add(currentRiddle);
      score += 10;
      solved++;
    }

    $("feedback").textContent =
      (language === "en"
        ? "Correct! +10 points. "
        : "إجابة صحيحة! +10 نقاط. ") +
      tr(riddle.explanation);

    $("feedback").className = "feedback good";

  } else {
    $("feedback").textContent =
      language === "en"
        ? "Not quite. Read the clue again and try the next challenge."
        : "ليست الإجابة الصحيحة. اقرأ التلميح مرة أخرى وحاول التحدي التالي.";

    $("feedback").className = "feedback bad";
  }

  updateStats();
}


// Hint
$("hintBtn").addEventListener("click", () => {
  $("hintText").textContent = tr(riddles[currentRiddle].hint);
});


// Next riddle
$("nextBtn").addEventListener("click", () => {
  currentRiddle = (currentRiddle + 1) % riddles.length;
  renderRiddle();
});


// ======================================
// SECRET ARCHIVE
// ======================================

function renderArchive() {
  const container = $("archiveContent");

  container.replaceChildren();

  riddles.forEach((riddle, index) => {
    const card = makeElement("article", "vault-card");

    card.append(
      makeElement(
        "h3",
        "",
        `${language === "en" ? "RIDDLE FILE" : "ملف اللغز"} 0${index + 1}`
      ),

      makeElement(
        "p",
        "archive-question",
        tr(riddle.question)
      ),

      makeElement(
        "p",
        "archive-answer",
        `${language === "en" ? "CORRECT ANSWER: " : "الجواب الصحيح: "}${tr(riddle.options[riddle.answer])}`
      ),

      makeElement(
        "p",
        "archive-explanation",
        `${language === "en" ? "EXPLANATION: " : "الشرح: "}${tr(riddle.explanation)}`
      )
    );

    container.appendChild(card);
  });

  container.classList.add("visible");
}


// Archive access
$("archiveForm").addEventListener("submit", event => {
  event.preventDefault();

  const enteredCode = $("archivePin").value.trim();

  if (enteredCode === "3333") {
    archiveUnlocked = true;

    renderArchive();

    $("archiveFeedback").textContent =
      language === "en"
        ? "ACCESS GRANTED. ARCHIVE UNLOCKED."
        : "تم السماح بالدخول. تم فتح الأرشيف.";

    $("archiveFeedback").className = "feedback good";

  } else {
    archiveUnlocked = false;

    $("archiveContent").classList.remove("visible");

    $("archiveFeedback").textContent =
      language === "en"
        ? "ACCESS DENIED. INCORRECT CODE."
        : "تم رفض الدخول. الرمز غير صحيح.";

    $("archiveFeedback").className = "feedback bad";
  }
});


// ======================================
// LANGUAGE SWITCH
// ======================================

function updateLanguage() {
  document.documentElement.lang = language;

  document.documentElement.dir =
    language === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-en][data-ar]").forEach(element => {
    element.innerHTML = element.getAttribute("data-" + language);
  });

  $("langBtn").textContent =
    language === "en" ? "العربية" : "English";

  renderRiddle();

  if (currentCase) {
    renderCase(currentCase);
  }

  if (archiveUnlocked) {
    renderArchive();
  }
}

$("langBtn").addEventListener("click", () => {
  language = language === "en" ? "ar" : "en";
  updateLanguage();
});


// ======================================
// MOBILE MENU
// ======================================

$("menuBtn").addEventListener("click", () => {
  $("nav").classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    $("nav").classList.remove("open");
  });
});


// ======================================
// INITIALIZE WEBSITE
// ======================================

updateStats();
updateLanguage();
