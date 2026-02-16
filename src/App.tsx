import { Calendar } from './components/Calendar';
import { TargetInput } from './components/TargetInput';
import { SyncButton } from './components/SyncButton';
import { StatusBar } from './components/StatusBar';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { useHourCalculations } from './hooks/useHourCalculations';
import { useTargetHours, useSkipStates, useSheetId } from './hooks/useLocalStorage';
import { getSheetTabName } from './utils/calendar';

function App() {
  const [target, setTarget] = useTargetHours();
  const [skippedDays, toggleSkip] = useSkipStates();
  const [sheetId, setSheetId] = useSheetId();
  const { workedHours, syncState, sync } = useGoogleSheets(sheetId);
  const calculations = useHourCalculations(workedHours, target, skippedDays);

  const monthLabel = getSheetTabName();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{monthLabel}</h1>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
          <TargetInput target={target} onChange={setTarget} />
          <SyncButton
            syncState={syncState}
            onSync={sync}
            sheetId={sheetId}
            onSheetIdChange={setSheetId}
          />
        </div>
      </header>

      <StatusBar
        totalWorked={calculations.totalWorked}
        target={target}
        plannedPerDay={calculations.plannedPerDay}
        remainingDays={calculations.remainingDays}
        goalReached={calculations.goalReached}
        allFutureSkipped={calculations.allFutureSkipped}
        syncState={syncState}
      />

      <div className="mt-4">
        <Calendar days={calculations.days} onToggleSkip={toggleSkip} />
      </div>
    </div>
  );
}

export default App;
