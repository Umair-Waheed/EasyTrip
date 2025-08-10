const PaymentStatus = ({ paymentId }) => {
    const [payment, setPayment] = useState(null);
    
    useEffect(() => {
      const checkStatus = async () => {
        const { data } = await axios.get(`/api/payment/${paymentId}`);
        setPayment(data);
      };
      checkStatus();
    }, [paymentId]);
  
    return (
      <div className={`payment-status ${payment?.status}`}>
        Status: {payment?.status || 'loading...'}
      </div>
    );
  };