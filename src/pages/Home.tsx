export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">IBSheet Grid Practice</h2>
          <p className="text-lg text-gray-600 mb-8">
            IBSheet 그리드를 연습해보세요!
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-500 mb-6">
              이 프로젝트는 IBSheet 그리드 컴포넌트를 학습하고 연습하기 위한 프로젝트입니다.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>시작하기:</strong> 상단 네비게이션에서 "IBSheet Grid" 페이지로 이동해보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}