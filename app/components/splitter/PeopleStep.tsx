import React, { useState } from "react";

interface PeopleStepProps {
  people: string[];
  suggestedPeople: string[];
  onAddPerson: (name: string) => void;
  onRemovePerson: (name: string) => void;
  onAddAllSuggestions: () => void;
  onBack: () => void;
  onNextStep: () => void;
}

export default function PeopleStep({
  people,
  suggestedPeople,
  onAddPerson,
  onRemovePerson,
  onAddAllSuggestions,
  onBack,
  onNextStep,
}: PeopleStepProps) {
  const [personInput, setPersonInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = personInput.trim();
    if (name) {
      onAddPerson(name);
      setPersonInput("");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pt-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Group Participants</h3>
        <p className="text-[10px] text-stone-400 uppercase tracking-widest">Add names of who is dining</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={personInput}
          onChange={(e) => setPersonInput(e.target.value)}
          placeholder="ENTER PARTICIPANT NAME..."
          className="flex-1 bg-white border border-stone-300 text-xs px-4 py-3 rounded-none outline-none focus:border-stone-950 uppercase"
          autoFocus
        />
        <button
          type="submit"
          className="bg-stone-950 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 hover:bg-stone-900 transition"
        >
          ADD
        </button>
      </form>

      {/* Suggested previous session participants */}
      {suggestedPeople.length > 0 && (
        <div className="p-4 bg-stone-50 border border-stone-200">
          <span className="block text-[8px] font-bold tracking-widest text-stone-400 uppercase mb-2">
            HISTORY SUGGESTIONS:
          </span>
          <div className="flex flex-wrap gap-1.5 items-center">
            {suggestedPeople.map((person) => {
              const isAdded = people.includes(person);
              return (
                <button
                  key={person}
                  disabled={isAdded}
                  type="button"
                  onClick={() => onAddPerson(person)}
                  className={`text-[10px] px-2.5 py-1 font-bold transition uppercase ${
                    isAdded
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200"
                      : "bg-white border-stone-300 text-stone-700 hover:border-stone-950"
                  }`}
                >
                  {person}
                </button>
              );
            })}
            <button
              type="button"
              onClick={onAddAllSuggestions}
              className="text-[10px] text-stone-950 font-bold uppercase tracking-wider hover:underline ml-2"
            >
              + Add All
            </button>
          </div>
        </div>
      )}

      {/* Current list of people */}
      <div className="space-y-2">
        <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase">
          Dining list ({people.length})
        </span>
        {people.length === 0 ? (
          <div className="p-8 border border-dashed border-stone-300 text-center text-xs text-stone-400 uppercase tracking-widest">
            No names added yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {people.map((person) => (
              <div
                key={person}
                className="flex items-center gap-1.5 bg-white border border-stone-300 text-xs font-bold px-3 py-2 text-stone-800 uppercase"
              >
                <span>{person}</span>
                <button
                  type="button"
                  onClick={() => onRemovePerson(person)}
                  className="text-stone-400 hover:text-stone-950 ml-1 font-bold focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-xs uppercase tracking-wider font-bold text-stone-900 border border-stone-400 px-4 py-2 hover:bg-stone-50 transition"
        >
          &larr; Back
        </button>

        <button
          type="button"
          onClick={onNextStep}
          disabled={people.length < 2}
          className="bg-stone-950 text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Assign Items &rarr;
        </button>
      </div>
    </div>
  );
}
