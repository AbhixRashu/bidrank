export default function Loading() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] bg-[#F8F7F3]">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-[#E6E4DF] border-t-[#FF8A00] animate-spin" />
      </div>
      <p className="text-lg font-semibold tracking-tight">
        <span className="text-[#FF8A00]">Ind</span>
        <span className="text-[#101114]">Bid</span>
      </p>
    </section>
  );
}
