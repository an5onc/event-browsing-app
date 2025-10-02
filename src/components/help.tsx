import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Lightweight types
type Faq = { id: string; q: string; a: React.ReactNode };

const staticFaqs: Faq[] = [
  {
    id: 'create-event',
    q: 'How do I create an event?',
    a: (
      <div>
        Go to <Link className="link" to="/create">Create Event</Link> and fill in: <strong>title</strong>, <strong>date & time</strong>, <strong>location</strong>, <strong>description</strong>, <strong>category</strong>, and optional <strong>image URL</strong>. Then submit.
      </div>
    ),
  },
  {
    id: 'edit-delete',
    q: 'How can I edit or delete an event?',
    a: (
      <div>
        Open your event’s page (from the list or your dashboard) and choose <strong>Edit</strong> or <strong>Delete</strong>. Only the creator or admins can modify or delete events.
      </div>
    ),
  },
  {
    id: 'rsvp',
    q: 'How do RSVPs work?',
    a: (
      <div>
        On an event page, click <strong>RSVP</strong> to add yourself. Click again to un-RSVP. Creators can see a count of RSVPs and the attendee list.
      </div>
    ),
  },
  {
    id: 'likes',
    q: 'How do likes work?',
    a: (
      <div>
        Click the <strong>Like</strong> button on an event to show support. Click again to remove your like. Likes help sort popular events.
      </div>
    ),
  },
  {
    id: 'search-filter',
    q: 'How do I search and filter events?',
    a: (
      <div>
        Use the search bar to match <em>title</em>, <em>description</em>, or <em>location</em>. Filter by <strong>category</strong> and <strong>date range</strong> using the filter bar on the Events page.
      </div>
    ),
  },
  {
    id: 'account',
    q: 'How do accounts work? Can I delete mine?',
    a: (
      <div>
        Sign up using your <strong>Bear ID</strong>. You may request account deletion from your profile or by contacting support. Admins can remove ex-student accounts.
      </div>
    ),
  },
];

const versionFromEnv =
  (import.meta as any)?.env?.VITE_APP_VERSION || (typeof process !== 'undefined' ? (process as any)?.env?.VITE_APP_VERSION : '') || '';

const Help: React.FC = () => {
  const [query, setQuery] = useState('');
  const [faqs, setFaqs] = useState<Faq[]>(staticFaqs);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);

  // Optional: lazy fetch for dynamic FAQs or status; failures are silent per spec
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Example: fetch status from /health if available
        const res = await fetch('/health', { method: 'GET' });
        if (!cancelled && res.ok) {
          const data = await res.json().catch(() => null);
          if (data?.status && data.status !== 'ok') setStatusMsg(`System status: ${data.status}`);
        }
      } catch {
        // ignore errors per spec
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(f =>
      f.q.toLowerCase().includes(q) ||
      (typeof f.a === 'string' ? (f.a as string).toLowerCase().includes(q) : false)
    );
  }, [query, faqs]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Help &amp; Support</h1>
        <p className="text-gray-600 mt-1">Find quick answers, troubleshooting tips, and ways to contact us.</p>
      </header>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions" className="mb-8">
        <h2 id="quick-actions" className="text-xl font-semibold mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/create" className="btn">Create an event</Link>
          <Link to="/" className="btn">Find events</Link>
          <Link to="/manage" className="btn">See my RSVPs</Link>
          <Link to="/manage" className="btn">Edit or delete my event</Link>
        </div>
      </section>

      {/* Status (optional) */}
      {statusMsg && (
        <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-3 text-amber-800">
          {statusMsg}
        </div>
      )}

      {/* FAQ search */}
      <label className="block mb-2 font-medium" htmlFor="help-search">Search FAQs</label>
      <input
        id="help-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type keywords: RSVP, delete, filters..."
        className="w-full mb-4 rounded border px-3 py-2"
        aria-label="Search frequently asked questions"
      />

      {/* FAQ accordion using details/summary for built-in accessibility */}
      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="text-xl font-semibold mb-3">FAQs</h2>
        {filtered.length === 0 ? (
          <p className="text-gray-600">No results for "{query}". Try different keywords.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map(item => (
              <details key={item.id} className="rounded border p-3">
                <summary className="cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {item.q}
                </summary>
                <div className="mt-2 text-gray-800">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* Troubleshooting */}
      <section aria-labelledby="troubleshoot" className="mb-10">
        <h2 id="troubleshoot" className="text-xl font-semibold mb-3">Troubleshooting</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Form won’t submit?</strong> Check required fields, date/time format, and your network connection.</li>
          <li><strong>Event not visible?</strong> Refresh the page, check active filters and the event start date, confirm you are the owner.</li>
          <li><strong>Can’t RSVP?</strong> Sign in, and make sure the event is accepting RSVPs for the current time window.</li>
        </ul>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact" className="mb-12">
        <h2 id="contact" className="text-xl font-semibold mb-3">Still need help?</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <a
            href="mailto:support@example.edu?subject=Events%20App%20Support"
            className="btn"
            onClick={() => console.log('contact_clicked:mailto')}
          >Email support</a>
          <button type="button" className="btn btn-secondary" onClick={() => setShowContact(true)}>Open contact form</button>
          <Link to="/help#status" className="text-sm text-gray-600 underline">System status</Link>
        </div>

        {/* Minimal, optional contact modal */}
        {showContact && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40">
            <div className="w-full max-w-md rounded bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-3">Contact support</h3>
              <form onSubmit={(e) => { e.preventDefault(); setShowContact(false); console.log('contact_clicked:form'); }}>
                <label className="block text-sm font-medium mb-1" htmlFor="subject">Subject</label>
                <input id="subject" className="w-full mb-3 rounded border px-3 py-2" placeholder="Brief subject" />
                <label className="block text-sm font-medium mb-1" htmlFor="desc">Description</label>
                <textarea id="desc" className="w-full mb-3 min-h-[120px] rounded border px-3 py-2" placeholder="Tell us what happened" />
                <div className="flex justify-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowContact(false)}>Cancel</button>
                  <button type="submit" className="btn">Send</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t pt-4 text-sm text-gray-600">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            {versionFromEnv && <span>App version: {versionFromEnv}</span>}
          </div>
          <div className="flex gap-3">
            <Link to="/terms" className="underline">Terms</Link>
            <Link to="/privacy" className="underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Help;