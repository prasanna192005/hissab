import ReceiptSplitter from "./components/ReceiptSplitter";

export const metadata = {
  title: "Hissab - Free AI Bill Splitter App for Groups | Split Restaurant Bills Instantly",
  description: "Snap a photo of your restaurant receipt and let AI extract items and split the bill among friends in seconds. No manual entry.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" id="app-root">
      {/* Accessibility Heading for SEO */}
      <h1 className="sr-only">Hissab - Free AI Bill Splitter App for Groups | Split Restaurant Bills Instantly</h1>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <ReceiptSplitter />
        </div>
      </main>
    </div>
  );
}
