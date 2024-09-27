import KanbanBoard from "./KanbanBoard";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-mainBackgroundColor">
      <div className="h-screen w-1/6 bg-columnBackgroundColor">sidebar</div>
      <KanbanBoard />
    </div>
  );
}
