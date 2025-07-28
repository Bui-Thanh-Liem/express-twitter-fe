export const FollowingContent = () => (
  <>
    <h2 className="text-xl font-bold mb-4 text-center">
      👥 Nội dung từ người bạn theo dõi
    </h2>

    {/* Sample content cho tab Following */}
    {Array.from({ length: 5 }, (_, index) => (
      <div key={index}>
        <h3 className="text-lg font-semibold mb-2">
          Video từ người dùng {index + 1}
        </h3>
        <div className="w-full aspect-video rounded-lg shadow overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Video sẽ được hiển thị ở đây</p>
        </div>
        {index < 4 && <hr className="my-6" />}
      </div>
    ))}
  </>
);
