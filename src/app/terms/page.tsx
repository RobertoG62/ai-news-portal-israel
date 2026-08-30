export const metadata = { title: "תנאי שימוש | AI Pulse ישראל" };

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-200">
      <a href="/" className="text-sm text-violet-300 underline">← חזרה לאתר</a>
      <h1 className="text-3xl font-bold mt-6 mb-2 text-white">תנאי שימוש</h1>
      <p className="text-sm text-gray-400 mb-10">עודכן: 30 באוגוסט 2026</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">מה זה</h2>
      <p className="leading-8 mb-4">האתר אוסף כותרות מפיד RSS של מקורות בתחום ה-AI, מתרגם ומסכם אותן לעברית, ומקשר למקור המלא.</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">הסיכומים נוצרים אוטומטית</h2>
      <p className="leading-8 mb-4">התרגום והתמצות מופקים במכונה, ללא עריכה אנושית לפני פרסום. עדכון רץ פעם ביום ומתפרסם ישירות לאתר.</p>
      <p className="leading-8 mb-4">משמעות הדבר: <b>איש לא קרא את הסיכום לפני שהופיע כאן.</b></p>
      <div className="border-r-4 border-violet-500 bg-white/5 rounded-lg px-5 py-4 my-6 leading-8">⚠️ הכותרת והסיכום שאתה קורא אינם דבריו של המקור אלא ניסוח מחדש שלהם. לפני ציטוט, שיתוף או הסתמכות — לחץ על הקישור וקרא את המקור עצמו.</div>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">על התווית "מקור רשמי מאומת"</h2>
      <p className="leading-8 mb-4">התווית מציינת דבר אחד בלבד: שהפריט הגיע מפיד ה-RSS הרשמי של אותו גוף, ולא מפורום או מרשת חברתית.</p>
      <p className="leading-8 mb-4"><b>היא אינה אומרת שמישהו אימת את התוכן</b>, שהעובדות נבדקו, או שהסיכום נאמן למקור. היא מתייחסת למקור הפריט, לא לנכונותו.</p>
      <h2 className="text-xl font-semibold mt-10 mb-3 text-white">הגבלת אחריות</h2>
      <p className="leading-8 mb-4">התוכן ניתן כמות שהוא:</p>
      <ul className="list-disc pr-6 space-y-2 mb-4 leading-8">
        <li>אין אחריות לדיוק התרגום או התמצות.</li>
        <li>אין אחריות לתוכן המקורות המקושרים.</li>
        <li>אין התחייבות לזמינות או לעדכון רציף.</li>
        <li>שמות חברות ומוצרים שייכים לבעליהם; האתר אינו קשור לאף אחת מהן.</li>
      </ul>
      <p className="text-sm text-gray-400 border-t border-white/10 mt-12 pt-6 leading-7"></p>
    </main>
  );
}
