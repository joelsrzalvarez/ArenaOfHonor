function Confirm({ message, onAcceptClick, onCancelClick}) {
    return <div className={`fixed top-0 w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-70`} >
        <div className='flex flex-col items-center justify-center border-2 border-black p-2 bg-white'>
            <h3>{message}</h3>
            <div className='flex gap-2'>
                <CancelButton onClick={onCancelClick}>Cancel</CancelButton>
                <RoundButton onClick={onAcceptClick}>Accept</RoundButton>
            </div>
        </div>
    </div>
}

export default Confirm