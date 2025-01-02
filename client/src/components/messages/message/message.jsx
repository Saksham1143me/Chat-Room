import ReactEmoji from 'react-emoji';
import './message.css'
function Message ({message = { user: null, text: '' },name}) {
    const {user,text}=message
    let isSentByCurrentUser=false
    let isSentByAdmin=false
    const trimmedName=name.trim().toLowerCase()
    // console.log("user is",user)
    if(user==='Admin'){
        isSentByAdmin=true
        isSentByCurrentUser=false
    }
    if(user===trimmedName){
        isSentByAdmin=false
        isSentByCurrentUser=true
    }
  return (
    // isSentByAdmin?(
    //     <div className="flex flex-col ">
    //         <div className="messageBox bg-slate-600">
    //           <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
    //         {/* <p className="sentText pl-10">{user}</p> */}
    //         </div>
    //       </div>
    // )
    // :
    isSentByCurrentUser
      ? (
        <div className="messageContainer flex-col justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
        )
  );
}
export default Message