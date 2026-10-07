export default function RequestError({ message, onRetry }) {
  return <div role="alert" className="my-6 rounded-xl bg-red-50 p-6 text-red-800">
    <p>{message || "Unable to load this page. Please try again."}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-3 font-semibold underline">Try again</button>}
  </div>;
}
