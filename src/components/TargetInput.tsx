interface TargetInputProps {
  target: number;
  onChange: (value: number) => void;
}

export function TargetInput({ target, onChange }: TargetInputProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="target-hours" className="text-sm font-medium text-gray-700">
        Target Hours:
      </label>
      <input
        id="target-hours"
        type="number"
        value={target}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          if (!isNaN(val) && val >= 0) onChange(val);
        }}
        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        min={0}
        step={1}
      />
    </div>
  );
}
