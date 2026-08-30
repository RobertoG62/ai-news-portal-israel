export const metadata = { title: "מדיניות פרטיות | AI Pulse ישראל" };

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-200">
      <a href="/" className="text-sm text-violet-300 underline">← חזרה לאתר</a>
      <h1 className="text-3xl font-bold mt-6 mb-2 text-white">מדיניות פרטיות</h1>
      <p className="text-sm text-gray-400 mb-10">עודכן: 30 באוגוסט 2026</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">הקצר</h2>
      <p className="leading-8 mb-4">האתר אינו אוסף עליך מידע, אין בו חשבון ואין בו טופס.</p>
      <p className="leading-8 mb-4">אין בו כלי אנליטיקה, אין פיקסל מעקב, ואין ולו עוגייה אחת.</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">צד שלישי — ומה השתנה</h2>
      <p className="leading-8 mb-4">עד אוגוסט 2026 הוצג לצד כל כתבה סמל האתר של המקור, שנטען <b>ישירות משרתי אותו מקור</b>. המשמעות: עצם הקריאה של דף הבית הודיעה ל-OpenAI, ל-NVIDIA ולשאר שאתה קורא אותו — לפני שלחצת על משהו.</p>
      <p className="leading-8 mb-4">הסמלים מוגשים כעת מתוך האתר. טעינת הדף אינה פונה לאף שרת חיצוני.</p>
      <div className="border-r-4 border-violet-500 bg-white/5 rounded-lg px-5 py-4 my-6 leading-8">הגופנים מוגשים גם הם מקומית. Next.js מוריד אותם בזמן הבנייה ומגיש אותם מהאתר, כך שאין פנייה ל-Google Fonts.</div>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">מאיפה מגיעות הכתבות</h2>
      <p className="leading-8 mb-4">האתר מושך פידים מ-OpenAI, Anthropic, NVIDIA, טלגרם ומקורות נוספים. <b>המשיכה מתבצעת בשרת של האתר, לא בדפדפן שלך</b> — כלומר אותם מקורות אינם רואים אותך ואינם מקבלים את כתובת ה-IP שלך. הדפדפן שלך מקבל מאיתנו עמוד מוכן.</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">קישורים למקורות</h2>
      <p className="leading-8 mb-4">כל כתבה מקשרת למקור שלה. לחיצה מעבירה אותך לאתר אחר, שמדיניותו חלה עליך שם. הקישורים אינם נטענים עד שתלחץ.</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">אירוח</h2>
      <p className="leading-8 mb-4">האתר מתארח ב-Vercel. כמו כל שרת אינטרנט, Vercel רושמת בקשות נכנסות לרבות כתובת IP, לצרכיה התפעוליים. אין לנו גישה לרישומים אלה ואיננו עושים בהם שימוש.</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">יצירת קשר</h2>
      <p className="leading-8 mb-4">שאלה בנושא פרטיות: robertog1692@gmail.com</p>
      <p className="text-sm text-gray-400 border-t border-white/10 mt-12 pt-6 leading-7">יושמו בקרות התומכות בדרישות תיקון 13 לחוק הגנת הפרטיות. אין לראות במסמך זה ייעוץ משפטי.</p>
    </main>
  );
}
