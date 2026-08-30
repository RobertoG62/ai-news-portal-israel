export const metadata = { title: "הצהרת נגישות | AI Pulse ישראל" };

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-200">
      <a href="/" className="text-sm text-violet-300 underline">← חזרה לאתר</a>
      <h1 className="text-3xl font-bold mt-6 mb-2 text-white">הצהרת נגישות</h1>
      <p className="text-sm text-gray-400 mb-10">עודכן: 30 באוגוסט 2026</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">המחויבות</h2>
      <p className="leading-8 mb-4">האתר נבנה כך שיהיה שמיש באמצעות מקלדת בלבד ובעזרת טכנולוגיות מסייעות.</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">מה בוצע בפועל</h2>
      <ul className="list-disc pr-6 space-y-2 mb-4 leading-8">
        <li>שפה וכיוון מוגדרים נכון בקוד (עברית, ימין-לשמאל).</li>
        <li>ניווט מלא במקלדת עם סימון מיקוד נראה.</li>
        <li>טקסט חלופי לסמלי המקורות.</li>
        <li>ניגודיות צבע נבדקה מול הדרישה של WCAG AA.</li>
        <li>הגופנים והסמלים מקומיים — הדף מוצג גם ללא גישה לרשת חיצונית.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">מה לא נבדק</h2>
      <p className="leading-8 mb-4">לא בוצעה בדיקה של מורשה נגישות מוסמך ולא נערכה בדיקה מקיפה בקורא מסך.</p>
      <div className="border-r-4 border-violet-500 bg-white/5 rounded-lg px-5 py-4 my-6 leading-8">לכן איננו מצהירים "האתר עומד בת"י 5568". ההצהרה מתארת את מה שנבדק בפועל, לא יותר.</div>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">נתקלת בבעיה</h2>
      <p className="leading-8 mb-4">פנייה בנושא נגישות: robertog1692@gmail.com</p>
      <p className="text-sm text-gray-400 border-t border-white/10 mt-12 pt-6 leading-7"></p>
    </main>
  );
}
