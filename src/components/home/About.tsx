// import { Building, Users, Award, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-4xl font-bold text-indigo-800 mb-4">About Our Hall</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chittagong University's Hall Management System represents a modern approach to student accommodation,
            combining tradition with technology to create a comfortable living environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              // icon: <Building className="w-8 h-8" />,
              title: "Modern Facilities",
              description: "State-of-the-art infrastructure with modern amenities",
              color: "from-blue-500 to-indigo-100"
            },
            {
              // icon: <Users className="w-8 h-8" />,
              title: "Strong Community",
              description: "Vibrant community of diverse students",
              color: "from-indigo-500 to-purple-100"
            },
            {
              // icon: <Award className="w-8 h-8" />,
              title: "Excellence",
              description: "Commitment to academic and personal growth",
              color: "from-purple-500 to-pink-100"
            },
            {
              // icon: <BookOpen className="w-8 h-8" />,
              title: "Rich History",
              description: "Proud legacy of academic excellence",
              color: "from-pink-500 to-rose-100"
            }
          ].map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white backdrop-blur-lg bg-opacity-80"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative">
                {/* <div className="text-indigo-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div> */}
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-8 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
              <p className="text-gray-600">
                To provide a safe, comfortable, and enriching living environment that fosters academic success,
                personal growth, and community engagement for all residents.
              </p>
              <ul className="space-y-2">
                {[
                  "Quality accommodation for all students",
                  "Fostering academic excellence",
                  "Building lasting relationships",
                  "Promoting cultural diversity"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src="https://scontent.fdac181-1.fna.fbcdn.net/v/t1.6435-9/122159055_3456950684395798_258414448971714380_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=U-HMhV4xv3kQ7kNvgFrarZN&_nc_zt=23&_nc_ht=scontent.fdac181-1.fna&_nc_gid=Ag_6ocjMQyj9wRfDsduu2EX&oh=00_AYBfBZHwCF1Jy3VgAxyoQhe44BOimeL8LMQfYoITyvxw0A&oe=67CFA8AA"
                alt="University Campus"
                className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;