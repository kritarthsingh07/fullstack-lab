// ============================================
// App.jsx
// This is the ONLY component in this project.
// It contains all the logic for the
// "Social Media Post Composer" lab experiment.
// ============================================

// useState -> lets us store and update data (called "state")
// useEffect -> lets us run code automatically at certain times
//              (like "when the page loads")
import { useState, useEffect } from "react";
import "./App.css";
import { CHARACTER_LIMITS, PLATFORMS } from "./utils";

function App() {
  // ---------------- STATE VARIABLES ----------------
  // State = data that React "remembers" and re-renders the UI
  // whenever it changes.

  // Currently selected platform (default: twitter)
  const [platform, setPlatform] = useState("twitter");

  // Text typed by the user in the textarea
  const [text, setText] = useState("");

  // List of all saved drafts. Starts empty.
  const [drafts, setDrafts] = useState([]);

  // If we are editing a draft, this stores that draft's id.
  // If it is null, it means we are creating a NEW draft.
  const [editingId, setEditingId] = useState(null);

  // Activity log messages (Draft Saved, Draft Deleted, etc.)
  const [logs, setLogs] = useState([]);

  // Status of the mock "Publish" API call.
  // Can be: "idle", "saving", "success", "failed"
  const [publishStatus, setPublishStatus] = useState("idle");

  // How many times we have retried publishing (max 3)
  const [retryCount, setRetryCount] = useState(0);

  // ---------------- LOAD DRAFTS ON PAGE LOAD ----------------
  // useEffect with an empty array [] as the second argument
  // means: "run this ONLY ONCE, when the component first loads"
  // This is how we load saved drafts from localStorage after a refresh.
  useEffect(() => {
    const savedDrafts = localStorage.getItem("drafts");
    if (savedDrafts) {
      // localStorage only stores strings, so we convert
      // the string back into a real JS array using JSON.parse
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  // ---------------- HELPER: ADD LOG ----------------
  // Adds a new message to the top of the activity log.
  // We only keep the latest 10 messages so the list doesn't grow forever.
  function addLog(message) {
    const time = new Date().toLocaleTimeString();
    setLogs((prevLogs) => [`${message} - ${time}`, ...prevLogs].slice(0, 10));
  }

  // ---------------- HELPER: SAVE DRAFTS TO localStorage ----------------
  // localStorage is used because it keeps data saved in the browser
  // even after the page is refreshed or closed (unlike normal state,
  // which resets every time the page reloads).
  function saveDraftsToStorage(updatedDrafts) {
    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
  }

  // ---------------- CHARACTER VALIDATION ----------------
  // Look up the limit for the current platform (e.g. 280 for twitter)
  const limit = CHARACTER_LIMITS[platform];
  // Count how many characters the user has typed
  const charCount = text.length;
  // Simple comparison: true if within limit, false if exceeded
  const isValid = charCount <= limit;

  // ---------------- SAVE DRAFT ----------------
  function handleSaveDraft() {
    // Don't save empty posts
    if (text.trim() === "") {
      alert("Please write something before saving!");
      return;
    }

    if (editingId) {
      // ----- UPDATE MODE -----
      // We are editing an existing draft, so we find it by id
      // and replace its platform/text with the new values.
      const updatedDrafts = drafts.map((draft) =>
        draft.id === editingId ? { ...draft, platform, text } : draft
      );
      setDrafts(updatedDrafts);
      saveDraftsToStorage(updatedDrafts);
      addLog("Draft Updated");
      setEditingId(null); // exit edit mode
    } else {
      // ----- CREATE MODE -----
      // Date.now() gives a unique number (milliseconds), good enough
      // to use as a simple unique id for a student project.
      const newDraft = { id: Date.now(), platform, text };
      const updatedDrafts = [...drafts, newDraft];
      setDrafts(updatedDrafts);
      saveDraftsToStorage(updatedDrafts);
      addLog("Draft Saved");
    }

    // Clear the textarea after saving
    setText("");
  }

  // ---------------- EDIT DRAFT ----------------
  // Loads the selected draft's data back into the composer
  // so the user can modify it.
  function handleEdit(draft) {
    setPlatform(draft.platform);
    setText(draft.text);
    setEditingId(draft.id); // remember which draft we are editing
  }

  // ---------------- DELETE DRAFT ----------------
  function handleDelete(id) {
    // filter() keeps every draft EXCEPT the one with this id
    const updatedDrafts = drafts.filter((draft) => draft.id !== id);
    setDrafts(updatedDrafts);
    saveDraftsToStorage(updatedDrafts);
    addLog("Draft Deleted");

    // If we were editing this draft and it got deleted, reset the form
    if (editingId === id) {
      setEditingId(null);
      setText("");
    }
  }

  // ---------------- MOCK PUBLISH (fake API call) ----------------
  // We use setTimeout to simulate a network request that takes time.
  // No real backend/API is used, as required by the assignment.
  function handlePublish() {
    if (!isValid || text.trim() === "") {
      alert("Fix errors before publishing!");
      return;
    }

    setPublishStatus("saving"); // show "Saving..."

    setTimeout(() => {
      // Randomly decide success or failure to simulate a real API
      // Math.random() gives a number between 0 and 1.
      // 60% chance of success, 40% chance of failure.
      const success = Math.random() > 0.4;

      if (success) {
        setPublishStatus("success");
        addLog("Published");
        setRetryCount(0); // reset retries after a successful publish
      } else {
        setPublishStatus("failed");
      }
    }, 1500); // 1.5 second fake delay
  }

  // ---------------- RETRY PUBLISH ----------------
  // Allowed a maximum of 3 retries, as required by the assignment.
  function handleRetry() {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
      handlePublish();
    }
  }

  // ---------------- STATISTICS ----------------
  // These are calculated fresh every render directly from "drafts".
  // No separate state needed, because they are just derived values.
  const totalDrafts = drafts.length;
  const twitterCount = drafts.filter((d) => d.platform === "twitter").length;
  const linkedinCount = drafts.filter((d) => d.platform === "linkedin").length;
  const instagramCount = drafts.filter((d) => d.platform === "instagram").length;

  // ---------------- UI (JSX) ----------------
  return (
    <div className="container">
      <h1>📝 Social Media Post Composer</h1>

      {/* ---------------- COMPOSER CARD ---------------- */}
      <div className="card">
        <h2>{editingId ? "Edit Draft" : "Create a Post"}</h2>

        {/* Dropdown to choose platform */}
        <label>Platform:</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Textarea for writing the post */}
        <textarea
          rows="5"
          value={text}
          placeholder="What's on your mind?"
          onChange={(e) => setText(e.target.value)}
        />

        {/* Character counter, e.g. "150 / 280" */}
        <p>
          {charCount} / {limit}
        </p>

        {/* Validation message changes color based on isValid */}
        <p className={isValid ? "success-text" : "error-text"}>
          {isValid ? "Ready to Publish" : "Character limit exceeded"}
        </p>

        <div className="button-row">
          <button onClick={handleSaveDraft}>
            {editingId ? "Update Draft" : "Save Draft"}
          </button>
          <button onClick={handlePublish} disabled={!isValid}>
            Publish
          </button>
        </div>

        {/* ---------------- MOCK API STATUS ---------------- */}
        {publishStatus === "saving" && <p>⏳ Saving...</p>}
        {publishStatus === "success" && (
          <p className="success-text">✅ Post Published Successfully</p>
        )}
        {publishStatus === "failed" && (
          <div>
            <p className="error-text">❌ Save Failed</p>
            {retryCount < 3 ? (
              <button onClick={handleRetry}>
                Retry ({retryCount}/3)
              </button>
            ) : (
              <p className="error-text">Max retries reached</p>
            )}
          </div>
        )}
      </div>

      {/* ---------------- STATISTICS CARD ---------------- */}
      <div className="card">
        <h2>Statistics</h2>
        <p>Total Drafts: {totalDrafts}</p>
        <p>Twitter Drafts: {twitterCount}</p>
        <p>LinkedIn Drafts: {linkedinCount}</p>
        <p>Instagram Drafts: {instagramCount}</p>
      </div>

      {/* ---------------- DRAFTS CARD ---------------- */}
      <div className="card">
        <h2>Saved Drafts</h2>
        {drafts.length === 0 && <p>No drafts yet.</p>}

        {drafts.map((draft) => (
          <div className="draft-item" key={draft.id}>
            <p>
              <strong>{draft.platform.toUpperCase()}</strong>
            </p>
            <p>{draft.text}</p>
            <div className="button-row">
              <button onClick={() => handleEdit(draft)}>Edit</button>
              <button onClick={() => handleDelete(draft.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- ACTIVITY LOG CARD ---------------- */}
      <div className="card">
        <h2>Activity Log</h2>
        {logs.length === 0 && <p>No activity yet.</p>}
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
