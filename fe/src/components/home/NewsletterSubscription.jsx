import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewsletterSubscription = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    console.log('Newsletter subscription submitted');
  };

  return (
    <section className="bg-blue-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Đăng ký nhận tin khuyến mãi</h2>
        <p className="mb-6">Nhận thông tin về sản phẩm mới và khuyến mãi hấp dẫn</p>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center w-full gap-0">
          <Input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-[8] rounded-r-none"
            required
            style={{
              backgroundColor: '#ffffff',
              color: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRight: 'none',
              borderRadius: '6px 0 0 6px'
            }}
          />
          <Button
            type="submit"
            className="flex-[2] px-3 py-1 rounded-l-none h-9 flex items-center justify-center font-semibold"
            style={{
              backgroundColor: '#dc2626', // red-600
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderLeft: 'none',
              borderRadius: '0 6px 6px 0',
              height: '36px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c'; // red-700
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626'; // red-600
            }}
          >
            Đăng ký
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
