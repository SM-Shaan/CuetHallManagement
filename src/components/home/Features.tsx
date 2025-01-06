 import { Home, Bell, MessageSquare, UtensilsCrossed, Bot, Clock } from 'lucide-react';

const features = [
  {
    icon: <Home className="w-6 h-6" />,
    title: 'Room Management',
    description: 'Easily manage room allocations and maintenance requests.',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Complaint System',
    description: 'Submit and track complaints with our efficient system.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Notice Board',
    description: 'Stay updated with important announcements and notices.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6" />,
    title: 'Dining Services',
    description: 'View meal schedules and manage dining preferences.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'Chatbox',
    description: 'Get instant answers to your queries 24/7.',
    color: 'from-rose-500 to-orange-500'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Real-time Updates',
    description: 'Receive instant notifications for important updates.',
    color: 'from-orange-500 to-yellow-500'
  }
];

const Features = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold text-gray-900">Our Features</h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to manage your hall experience efficiently
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`} />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-indigo-100 p-3 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;