interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

export function Card({ title, children, icon }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}
