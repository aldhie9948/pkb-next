const Loading = () => {
  return (
    <div className='loading grid place-items-center absolute z-50 top-0 left-0 right-0 bottom-0 bg-black-rgba'>
      <div className='lds-ripple'>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
