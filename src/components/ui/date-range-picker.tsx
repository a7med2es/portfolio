import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

export function DateRangePicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void; 
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [isPresent, setIsPresent] = useState(false);

  // Parse initial value like "01/2024 - 06/2025" or "07/2025 - Present"
  useEffect(() => {
    if (!value) return;
    const parts = value.split(" - ");
    if (parts.length === 2) {
      const parseDate = (d: string) => {
        if (d === "Present" || !d) return "";
        const [m, y] = d.split("/");
        return m && y ? `${y}-${m.padStart(2, '0')}` : "";
      };
      setStart(parseDate(parts[0]));
      if (parts[1] === "Present") {
        setIsPresent(true);
        setEnd("");
      } else {
        setIsPresent(false);
        setEnd(parseDate(parts[1]));
      }
    }
  }, [value]);

  const updateValue = (s: string, e: string, p: boolean) => {
    const format = (d: string) => {
      if (!d) return "";
      const [y, m] = d.split("-");
      return `${m}/${y}`;
    };
    const sStr = format(s) || "";
    const eStr = p ? "Present" : format(e);
    
    if (sStr && eStr) {
      onChange(`${sStr} - ${eStr}`);
    } else if (sStr) {
      onChange(sStr);
    } else {
      onChange("");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-2 rounded-md border border-slate-200">
      <div className="flex items-center gap-2">
        <Label className="text-xs text-slate-500 whitespace-nowrap">From:</Label>
        <input 
          type="month" 
          value={start} 
          onClick={(e) => { try { if ("showPicker" in HTMLInputElement.prototype) e.currentTarget.showPicker(); } catch(err){} }}
          onChange={(e) => { setStart(e.target.value); updateValue(e.target.value, end, isPresent); }}
          className="text-sm border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-blue-400 bg-transparent cursor-pointer w-32"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-xs text-slate-500 whitespace-nowrap">To:</Label>
        <input 
          type="month" 
          value={end} 
          disabled={isPresent}
          onClick={(e) => { try { if (!isPresent && "showPicker" in HTMLInputElement.prototype) e.currentTarget.showPicker(); } catch(err){} }}
          onChange={(e) => { setEnd(e.target.value); updateValue(start, e.target.value, isPresent); }}
          className="text-sm border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-blue-400 disabled:opacity-50 disabled:bg-slate-100 bg-transparent cursor-pointer w-32"
        />
      </div>
      <label className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer pl-1">
        <input 
          type="checkbox" 
          checked={isPresent} 
          onChange={(e) => { setIsPresent(e.target.checked); updateValue(start, end, e.target.checked); }}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
        />
        <span className="text-xs font-medium">Present</span>
      </label>
    </div>
  );
}
