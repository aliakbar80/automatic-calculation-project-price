"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { calculate, getConfig, type CalculateRequest, type CalculateResponse } from "@/lib/api";
import { useMemo, useState } from "react";

export default function Home() {
  const [form, setForm] = useState<CalculateRequest>({
    projectType: "webapp",
    scale: "small",
    technologies: [],
    pagesOrModules: 5,
    specialFeatures: [],
    delivery: "normal",
    complexity: 2,
    risk: 2,
    profitMargin: 0.2,
  });

  const { data: config } = useQuery({ queryKey: ["config", form.projectType], queryFn: () => getConfig(form.projectType) });
  const mutation = useMutation({ mutationFn: (body: CalculateRequest) => calculate(body) });

  const coeff = config?.coefficients || {};

  function update<K extends keyof CalculateRequest>(key: K, value: CalculateRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border dark:border-zinc-800 p-5 space-y-4 text-zinc-900 dark:text-zinc-100">
          <h1 className="text-xl font-bold">فرم محاسبه قیمت</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">نوع پروژه</label>
              <p className="text-xs text-zinc-500 mb-1">نوع کلی محصول نرم‌افزاری شما</p>
              <select className="w-full border rounded-lg p-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" value={form.projectType} onChange={(e) => update("projectType", e.target.value as any)}>
                <option value="webapp">وب‌اپ</option>
                <option value="shop">فروشگاه</option>
                <option value="erp">ERP</option>
                <option value="landing">Landing Page</option>
                <option value="cms">CMS</option>
                <option value="crm">CRM</option>
                <option value="mobile">موبایل</option>
                <option value="saas">SaaS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">مقیاس</label>
              <p className="text-xs text-zinc-500 mb-1">کوچک/متوسط/بزرگ بودن دامنه پروژه</p>
              <select className="w-full border rounded-lg p-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" value={form.scale} onChange={(e) => update("scale", e.target.value as any)}>
                <option value="small">کوچک</option>
                <option value="medium">متوسط</option>
                <option value="large">بزرگ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">تعداد صفحات/ماژول</label>
              <p className="text-xs text-zinc-500 mb-1">مازاد بر ۵، هر مورد حدود ۴٪ هزینه را افزایش می‌دهد</p>
              <input className="w-full border rounded-lg p-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" type="number" min={0} value={form.pagesOrModules} onChange={(e) => update("pagesOrModules", Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm mb-1">زمان تحویل</label>
              <p className="text-xs text-zinc-500 mb-1">فوری/سریع هزینه را به‌خاطر فشردگی زمان افزایش می‌دهد</p>
              <select className="w-full border rounded-lg p-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" value={form.delivery} onChange={(e) => update("delivery", e.target.value as any)}>
                <option value="normal">عادی</option>
                <option value="fast">سریع</option>
                <option value="urgent">فوری</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">پیچیدگی (۱ تا ۳)</label>
              <p className="text-xs text-zinc-500 mb-1">۱ ساده، ۲ متوسط، ۳ پیچیده (معماری/الگوریتم خاص)</p>
              <input className="w-full border rounded-lg p-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" type="number" min={1} max={3} value={form.complexity} onChange={(e) => update("complexity", Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm mb-1">ریسک (۱ تا ۳)</label>
              <p className="text-xs text-zinc-500 mb-1">۱ پایین، ۲ متوسط، ۳ بالا (ابهام/تغییرات/وابستگی‌ها)</p>
              <input className="w-full border rounded-lg p-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" type="number" min={1} max={3} value={form.risk} onChange={(e) => update("risk", Number(e.target.value))} />
            </div>
            
            
            <div>
              <label className="block text-sm mb-1">حاشیه سود</label>
              <p className="text-xs text-zinc-500 mb-1">بین ۰ تا ۱؛ مثال 0.2 یعنی ۲۰٪ سود</p>
              <input className="w-full border rounded-lg p-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100" type="number" step="0.01" min={0} value={form.profitMargin} onChange={(e) => update("profitMargin", Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">تکنولوژی‌ها</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(coeff["technology"] || []).map((t: any) => (
                <button key={t.key} className={`px-3 py-1 rounded-full border dark:border-zinc-700 ${form.technologies.includes(t.key) ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"}`} onClick={() => update("technologies", form.technologies.includes(t.key) ? form.technologies.filter((x) => x !== t.key) : [...form.technologies, t.key])}>
                  {t.label || t.key}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">فیچرها</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(coeff["feature"] || []).map((f: any) => (
                <button key={f.key} className={`px-3 py-1 rounded-full border dark:border-zinc-700 ${form.specialFeatures.includes(f.key) ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"}`} onClick={() => update("specialFeatures", form.specialFeatures.includes(f.key) ? form.specialFeatures.filter((x) => x !== f.key) : [...form.specialFeatures, f.key])}>
                  {f.label || f.key}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-black dark:bg-white text-white dark:text-black rounded-lg py-2 disabled:opacity-50" onClick={() => {
            // بدون نمایش یا دریافت دستی نرخ دلار؛ در بک‌اند تامین می‌شود
            const body: CalculateRequest = { ...form };
            mutation.mutate(body);
          }} disabled={mutation.isPending}>
            محاسبه
          </button>
        </div>

        <div className="bg-white dark:bg-black rounded-xl shadow-sm border dark:border-zinc-800 p-5 space-y-4 text-zinc-900 dark:text-zinc-100">
          <h2 className="text-lg font-semibold">خلاصه محاسبه</h2>
          {mutation.isSuccess ? <BreakdownCard data={mutation.data} /> : <p className="text-sm text-gray-500">نتیجه محاسبه پس از ارسال فرم نمایش داده می‌شود.</p>}
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({ data }: { data: CalculateResponse }) {
  const rows = [
    ["قیمت پایه (دلار)", `$ ${data.baseUsd.toLocaleString()}`],
    ["قیمت پایه (تومان)", `${Math.round(data.baseIrr).toLocaleString()} تومان`],
    ["پس از تورم (تومان)", `${Math.round(data.inflationApplied).toLocaleString()} تومان`],
    ["ضریب زمان تحویل", data.deliveryMultiplier],
    ["ضریب پیچیدگی", data.complexityMultiplier],
    ["ضریب ریسک", data.riskMultiplier],
    ["ضریب تکنولوژی", data.technologiesMultiplier],
    ["ضریب فیچرها", data.featuresMultiplier],
    ["ضریب مازاد ماژول", data.modulesMultiplier.toFixed(2)],
    ["جمع جزء (تومان)", `${Math.round(data.subtotal).toLocaleString()} تومان`],
    ["سود (تومان)", `${Math.round(data.profitAmount).toLocaleString()} تومان`],
    ["مبلغ نهایی (تومان)", `${Math.round(data.total).toLocaleString()} تومان`],
  ];
  return (
    <div className="overflow-hidden rounded-lg border dark:border-zinc-800">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-gray-50 dark:odd:bg-zinc-800/60">
              <td className="p-3 font-medium">{r[0]}</td>
              <td className="p-3 text-left">{r[1] as any}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
