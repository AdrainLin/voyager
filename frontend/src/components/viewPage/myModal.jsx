import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import axios from 'axios';


class myModal extends React.Component {
    state = { 
        commentText:"",
     } 

    //slider設定
    settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }; 
    checkLoginState = ()=>{
        let state = true;
        const {loginUid} = this.props;
        if(loginUid === null){
            state = false; 
            alert("請先登入會員");
        }
        return state;
    }
    //新增留言未做: 新增後滑動到流言處、enter換行
    postComment = async()=>{
        
        if(!(this.checkLoginState())) return;

        let dataToServer = {
            commentText:this.state.commentText,
            postid:this.props.info[0].postid,
            uid:this.props.loginUid
        }
        let result = await axios.post(`http://localhost:8000/viewPage/postComment`,dataToServer);
        this.setState({commentText:""});
        this.props.handleModal(this.props.info[0].postid);
    }
    //點愛心改變已點讚或未點讚,點擊後的狀態傳給handleLikeState
    clickLike = async(postid)=>{ 
        let state = 0; 
        const {loginUid,info,likeState,handleLikeState} = this.props;   

        if(!(this.checkLoginState())) return;

        if(likeState){
            await axios.delete(`http://localhost:8000/viewPage/cancelLike?uid=${loginUid}&postid=${info[0].postid}`);
            handleLikeState(postid,state);
        }else{
            state = 1;
            await axios.post(`http://localhost:8000/viewPage/addLike?uid=${loginUid}&postid=${info[0].postid}`);  
            handleLikeState(postid,state);
        }
    }
    clickSaving = async()=>{
        let state = 0;
        const {savingState,loginUid,info,handleSavingState} = this.props; 
        // console.log("click savingBtb props.likeState: ",savingState);
        if(!(this.checkLoginState())) return;
        
        if(savingState){
            await axios.delete(`http://localhost:8000/viewPage/deleteSavingState?uid=${loginUid}&postid=${info[0].postid}`)
            handleSavingState(state);
        }else{
            state = 1;
            await axios.post(`http://localhost:8000/viewPage/addSavingState?uid=${loginUid}&postid=${info[0].postid}`)
            handleSavingState(state)
        }
    }
    //轉換日期格式:UTC轉當地時間
    formatTimeForComment = (utcDateString)=>{ 
        let localDateString = this.formatTimeForPost(utcDateString);
        const utcDate = new Date(utcDateString);
        let hours = utcDate.getHours();
        var minutes = utcDate.getMinutes();
        var seconds = utcDate.getSeconds();
        
        if(hours < 12){
            localDateString += ` 
            上午${hours < 10 ?'0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds: seconds}`;
        }else{
            hours -= 12; 
            localDateString += ` 
            下午${hours < 10 ?'0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds: seconds}`;
        }
        return localDateString;
    }
    formatTimeForPost = (utcDateString) => { 
        const utcDate = new Date(utcDateString);
        const year = utcDate.getFullYear();
        const month = (utcDate.getMonth() + 1); 
        const day = utcDate.getDate(); 
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`; 
    }
    render() { 
        //貼文內容換行字串處理
        let postContent = (this.props.info.length)?this.props.info[0].postcontent:"";
        let formatContentAry = postContent.split('\r\n');

        let isOpen = this.props.modalIsOpen ;
        let onClose = this.props.modalIsClose ;
      

        
        return (
            <Modal show={isOpen} onHide={onClose} size="xl" centered id="viewPageModal" className="viewModal">
                         
                <div id="mybox" className="mybox d-flex flex-row flex-wrap w-100 h-100">
                    <div className="imgArea col-12 col-sm-6 d-flex align-items-center h-100 flex-shrink-1">   
                    
                    {this.props.info.length === 1 ? (
                            <img 
                                src={`data:image/jpeg;base64,${this.props.info[0].img}`} 
                                alt="img" 
                                style={{ width: '100%', height: 'auto' }}
                            />
                        ) : (
                            <Slider {...this.settings}>
                                {this.props.info.map((image, index) => (
                                    <div key={index}>
                                        <img 
                                            src={`data:image/jpeg;base64,${image.img}`} 
                                            alt="img" 
                                            style={{ width: '100%', height: 'auto' }} 
                                        />
                                    </div>
                                ))}
                            </Slider>
                        )}
                    </div> 
                    
                    <div className="postArea col-12 col-sm-6 d-flex flex-column px-2 h-100 flex-shrink-1">
                        
                        <div className="postHead d-flex align-items-end justify-content-between border-bottom border-secondary py-2">
                            <h3 className="mb-0 d-inline-block">{(this.props.info.length)?this.props.info[0].title:""}</h3>
                            <p className='mb-0'>{(this.props.info.length)?this.formatTimeForPost(this.props.info[0].postdate):""}</p>        
                        </div>

                        <div className="postBody h-100 px-2">

                            <div className="userPost py-2 d-flex">

                                <div className="postIconSpace d-flex justify-content-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="currentColor" className="d-block bi bi-person-circle myicon" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                    </svg>
                                </div>

                                <div className="postContent mt-1">
                                    <a href=""><b>{this.props.info.length?this.props.info[0].account:""}</b></a>
                                    
                                    <p className='mt-2'>
                                    {
                                        formatContentAry.map(sentence =>{
                                            return(
                                                <React.Fragment>
                                                    {sentence}<br/>
                                                </React.Fragment>
                                            );
                                        })
                                    }

                                    </p>
                                    <p className="postTag">
                                        {this.props.tag.map(tag=>{
                                            return(
                                                <React.Fragment>
                                                    <a href="" className='me-1'>#{tag.tag}</a>
                                                </React.Fragment>
                                            )
                                        })}
                                    </p>
                                </div>
                                
                                <div className="likeBtnSpace"></div>
                            </div>

                            {
                                this.props.comment.map((comment,index)=>{
                                    

                                    return(
                                        <div className="postComment py-2 d-flex">

                                            <div className="postIconSpace d-flex justify-content-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="currentColor" className="d-block bi bi-person-circle myicon" viewBox="0 0 16 16">
                                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                                </svg>
                                            </div>

                                            <div className="postContent">
                                                <a href=""><b>{this.props.commentAccount[index].account}</b></a>
                                                <p> 
                                                    {comment.comment}
                                                </p>
                                                <p>
                                                    <span className="commentTime me-2">{this.formatTimeForComment(comment.commenttime)}</span>
                                                    <span className="likeCounter ms-1">{comment.likecounter}個讚</span>
                                                    <span className="commentCounter ms-1">回覆</span>
                                                    
                                                </p>
                                            </div>

                                            <div className="likeBtnSpace">
                                                
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
                                                    <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                                                </svg>
                                            </div>

                                        </div>

                                    );
                                })
                            }
                            

                            
                        </div>
                        
                        <div className="postFoot">
                            <div className="postInfo py-1 border-top border-1 border-secondary">
                                <button id="viewLikeIcon" className="iconBtn" onClick={()=>{this.clickLike(this.props.info[0].postid)}}>
                                    {
                                    (this.props.likeState)?(
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className=" bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                                        </svg>
                                    ):(<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className=" bi bi-suit-heart" viewBox="0 0 16 16">
                                            <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                                        </svg>
                                    )}
                                </button>
                                <span className="postTotalLike ms-2">{(this.props.likeCounter)?this.props.likeCounter:0}個讚</span>
                                <span className="postTotalComment ms-2">{(this.props.commentCounter.length)?this.props.commentCounter[0].comment_counter:""}則回覆</span>  
                                <button id="viewSavingIcon"className='border-0 float-end' onClick={this.clickSaving}>
                                {
                                (this.props.savingState)?(
                                    <svg className="bi bi-bookmark-fill" width="28" height="28" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M3 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12l-5-3-5 3V3z"/>
                                    </svg>
                                ):(<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                                    </svg>
                                )}                                   
                            </button>    
                            </div>
                            <div className="writeCommentBox py-2 border-top border-1 border-secondary d-flex align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-chat d-block flex-shrink-0" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                </svg>
                                <div className="textAreaBox ms-2 d-flex align-items-center">
                                    <textarea   rows="1" cols="50" className="w-100 border-0" placeholder='我要留言..'
                                                style={{ resize: 'none' }}
                                                value={this.state.commentText}
                                                onChange={e=> {this.setState({commentText:e.target.value});console.log(this.state.commentText)}}>            
                                    </textarea>
                                </div>
                                <a href="#" className="text-primary sendBtn flex-shrink-0" onClick={(e) => { e.preventDefault(); this.postComment(); }}>發布</a>
                            </div>
                        </div>
                    </div>
                </div>
                       
                
          </Modal>

        );
    }
}
 
export default myModal;