export default function Home() {
  return (
    <div className="bg-gray-900 text-white">
      <section className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-white border-2 border-blue-500 p-4 rounded-lg shadow-lg bg-gray-800">
          Welcome to Next.js with Tailwind CSS
        </h1>
        <p className="mt-4 text-xl text-gray-300">Scroll down to see the navbar border effect</p>
      </section>
      
      {/* Additional sections to enable scrolling */}
      <section className="min-h-screen bg-gray-800 p-24 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white">Section 2</h2>
        <p className="mt-4 text-xl">This section helps demonstrate the navbar scroll effect.</p>
      </section>
      
      <section className="min-h-screen bg-gray-900 p-24 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white">Section 3</h2>
        <p className="mt-4 text-xl">Another section for scrolling demonstration.</p>
      </section>
    </div>
  );
}
