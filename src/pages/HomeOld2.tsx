import { Link } from 'react-router-dom';
import { useAuth } from '@/auth';
import { 
  TableCellsIcon, 
  ChartBarIcon, 
  CogIcon, 
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: TableCellsIcon,
      title: 'IBSheet 그리드',
      description: '강력한 데이터 그리드 컴포넌트로 대용량 데이터를 효율적으로 관리하세요.',
      href: '/ibsheet'
    },
    {
      icon: ChartBarIcon,
      title: '데이터 시각화',
      description: '다양한 차트와 그래프로 데이터를 직관적으로 표현하세요.',
      href: '/charts'
    },
    {
      icon: CogIcon,
      title: '설정 관리',
      description: '사용자 맞춤형 설정으로 최적의 작업 환경을 구성하세요.',
      href: '/settings'
    },
    {
      icon: DocumentTextIcon,
      title: '문서 관리',
      description: '프로젝트 문서와 가이드를 체계적으로 관리하세요.',
      href: '/docs'
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Grid Practice
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            IBSheet 그리드를 활용한 React 연습 프로젝트입니다. 
            강력한 데이터 그리드 기능을 체험해보세요.
          </p>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                환영합니다, <span className="font-semibold">{user?.name || user?.username}님!</span>
              </p>
              <Link 
                to="/ibsheet"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <TableCellsIcon className="h-5 w-5 mr-2" />
                IBSheet 그리드 시작하기
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                시작하기
              </Link>
              <Link 
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                로그인
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              주요 기능
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              다양한 기능들을 통해 React 개발을 연습해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <Link 
                  to={feature.href}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  자세히 보기 →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg p-12 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">지금 바로 시작해보세요!</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            IBSheet 그리드의 강력한 기능을 직접 체험해보고, 
            데이터 관리의 새로운 차원을 경험하세요.
          </p>
          <Link 
            to="/ibsheet"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <TableCellsIcon className="h-5 w-5 mr-2" />
            IBSheet 그리드 체험하기
          </Link>
        </div>
      </div>
    </div>
  );
}