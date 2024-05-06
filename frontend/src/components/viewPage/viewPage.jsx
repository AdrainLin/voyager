import React from 'react';
import axios from 'axios';
import MyModal from './myModal.jsx';
import '../../css/viewPage.css';


//左側地區篩選欄
class FilterBar extends React.Component{

    state = {
        
    }
    locationData = [
        {area:'北部地區',
        location:['台北市','新北市','桃園市','基隆市','新竹市','新竹縣']},
        {area:'中部地區',
        location:['台中市','苗栗市','彰化市','南投市','雲林市']},
        {area:'南部地區',
         location:['高雄市','台南市','嘉義市','嘉義縣','屏東縣']},
        {area:'東部地區',
         location:['宜蘭縣','花蓮縣','台東縣']}
    ]
    //取得各地區內的縣市名稱
    getlocationName = (locationAry) => {

        let isClikedLocation = this.props.location;
        let newAry = locationAry.map(locationName => (
            <li key={locationName} 
                onClick={()=>{this.clickLocation(locationName)}}
                style={locationName===isClikedLocation?{backgroundColor:"rgb(201, 213, 223)"}:{}}>
            {locationName}</li>
        ))
        return newAry;
    };
    clickLocation= async(locationName)=>{
        console.log(locationName);
        this.props.handleLocation(locationName);
    }

    render(){
        return(
            <div className="filterBar col-2 d-none d-lg-block position-sticky sticky-top vh-">
                <div className="locationTitle mb-1 border-bottom border-3 d-flex align-items-center w-75">
                    <h4 className="mb-0 mt-0 position-absolute">地區{this.isClikedLocation}</h4>
                </div>
                <div>
                {
                this.locationData.map((locationObj,index) =>{
                    return(
                        <React.Fragment key={index}>
                            <h5 >{locationObj.area}</h5>
                            <ul className="nav flex-column w-75">
                                {this.getlocationName(locationObj.location)}
                            </ul>
                        </React.Fragment>
                    )
                })
                } 
                </div>     
            </div>
        );
    }
    
}
    
//圖牆內容+搜尋排序
class Content extends React.Component{
    
    state={
        inputText:""
    }
    
    render(){
       
        return(
            <div className="content row col-12 col-lg-10">
                <div className=" col-12 d-flex align-items-center justify-content-between">
                    {/*搜尋框*/}
                    <div className="searchBox mb-1 ps-3 border border-3 rounded-pill d-flex align-items-center">
                        <input className="h-100 border-0" type="text" placeholder="請輸入關鍵字:" 
                               onChange={(e)=>{
                                    this.setState({inputText:e.target.value},
                                    ()=>{this.sarchClick(this.state.inputText)});                  
                               }} 
                        />
                        <button className="btn ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                        </button>
                    </div>    
                    {/*排序按鈕*/}
                    <div className="sortBox d-flex justify-content-between px-0">
                        <button className="badge border-0 text-dark" 
                                onClick={()=>{this.changeSort('new');}}
                        >最新</button>
                        <button className="badge border-0 text-dark" 
                                onClick={()=>{this.changeSort('popular');}}        
                        >熱門</button>
                    </div>
                </div>      
                {this.props.dataAry.map(post=>
                    <div className="col-4 col-md-4 postbox mt-3 p-0" id={post.postid}
                         onClick={()=>{this.changeModalContent(post.postid)}}
                    >
                        
                        <img src={`data:image/jpeg;base64,${post.img}`} alt="img"/>
                        <div className='postHideIconBox flex-grow-0 position-absolute top-50 start-50 '>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className=" bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                            </svg>
                            <span className='ms-2'>{(post.listTotalLike)?post.listTotalLike:0}</span>
                        </div>
                    </div>
                    
                )}                
            </div>
        );
    }

    changeModalContent = (postid)=>{
        this.props.handleModal(postid);
    }
    sarchClick = (sarchText)=>{
        this.props.handleSarchText(sarchText);
    }
    changeSort = (sortString) =>{
        this.props.getSortString(sortString);
    }

}

//網站內容容器
class Container extends React.Component{
    state = {
        dataAry:[],
        modalInfoAry:[],
        postTagAry:[],
        postCommentAry:[],
        commentCounter:[],
        userAccount:[],
        commentAccount:[],
        likeCounter:0,
        likeState:0,
        savingState:0,
        loginUid:this.props.loginUid,
        modalIsOpen:false,
        sarchText:'',
        location:this.props.location,
        listSort:'new'
         
    }
    render() {

        return(  
            <div className="container mt-3 d-flex gx-5 align-items-start mb-3">
                <MyModal  
                        info={this.state.modalInfoAry} 
                        tag={this.state.postTagAry} 
                        comment = {this.state.postCommentAry}
                        commentCounter = {this.state.commentCounter}                   
                        commentAccount = {this.state.commentAccount}      
                        likeState = {this.state.likeState}
                        savingState = {this.state.savingState}
                        loginUid = {this.state.loginUid}
                        likeCounter= {this.state.likeCounter}
                        handleModal = {this.handleModal}
                        handleLikeState = {this.handleLikeState} 
                        handleSavingState = {this.handleSavingState}
                        modalIsOpen = {this.state.modalIsOpen}
                        modalIsClose = {this.handleModalColse}
                        />
                <FilterBar handleLocation={this.handleLocation} 
                           sarchText={this.state.sarchText}
                           location={this.state.location} 
                           />

                <Content dataAry={this.state.dataAry} handleModal={this.handleModal}
                         handleSarchText={this.handleSarchText} 
                         getSortString = {this.getSortString}
                         listSort = {this.state.listSort}
                />
            </div>
        );
    }
    
    componentDidMount = async() =>{
        localStorage.setItem("previouspath", window.location.pathname) 
        let result = await axios.get(`http://localhost:8000/viewPage/locationFilter?lname=${this.state.location}&tag=${this.state.sarchText}`);
        let newState = {...this.state};
        newState.dataAry = result.data;
        newState.loginUid = this.props.loginUid ; 
        console.log("didmout get data:");
        console.log(newState);
        this.setState(newState);
    }

    getSortString = (sortString)=>{
        let newState = {...this.state};
        newState.listSort = sortString;
        newState.dataAry = this.handleListSort(sortString,newState.dataAry);
        this.setState(newState);
    }

    handleListSort = (sortString,dataAry)=>{         
        if(sortString==='popular'){
            console.log("do sort by popular");
            dataAry.sort((front,next)=> (
                next.listTotalLike - front.listTotalLike))
        }else if(sortString==='new'){
            console.log("do sort by new");
            console.log(dataAry);
            dataAry.sort((front,next)=>{
               
                let dateA = new Date(front.postdate);
                let dateB = new Date(next.postdate);
                return dateB - dateA;
            }) 
        }
        return dataAry;
    }
   
    handleModal = async(postid)=>{
        console.log("do handleModal");
        const [postContent, postTag,postComment,
              commentCounter,commentAccount,likeState,savingState] = await Promise.all([

            axios.get(`http://localhost:8000/viewPage/getModal?postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getTag?postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getComment?postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getCommentCouner?postid=${postid}`),        
            axios.get(`http://localhost:8000/viewPage/getCommentAccount?postid=${postid}`),           
            axios.get(`http://localhost:8000/viewPage/getLikeState?uid=${this.state.loginUid}&postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getSavingState?uid=${this.state.loginUid}&postid=${postid}`)       
        ]);

        let newState = {...this.state};

        newState.modalInfoAry = postContent.data;   
        newState.postTagAry = postTag.data;     
        newState.postCommentAry = postComment.data;
        newState.commentCounter = commentCounter.data ; 
        newState.commentAccount = commentAccount.data;
        newState.likeState = likeState.data[0].state;
        newState.savingState = savingState.data[0].state;
        newState.modalIsOpen = true ; 

        for(let i=0;i<this.state.dataAry.length;i++){
            if(this.state.dataAry[i].postid===postid){
                newState.likeCounter = this.state.dataAry[i].listTotalLike; 
            }
        }

        console.log("change to newState:",newState);  
        this.setState(newState);
    }
    handleModalColse = ()=>{
        let newState = {...this.state};
        newState.modalIsOpen = false;
        console.log("modal close!");
        this.setState(newState);
    }
    //state是關閉modal後的like狀態
    handleLikeState = (postid,state)=>{  
        console.log("do handleLikeState");
        let newState = {...this.state};       
        newState.likeState = state; 
        for(let i=0;i<this.state.dataAry.length;i++){
            if(this.state.dataAry[i].postid===postid){
               if(state){     
                    newState.dataAry[i].listTotalLike+=1;
                    newState.likeCounter+=1;
                }else{      
                    newState.dataAry[i].listTotalLike-=1; 
                    newState.likeCounter-=1;        
                }                
            }
        }
        this.setState(newState);  
    }

    handleSavingState = (state)=>{   
        let newState = {...this.state};
        newState.savingState = state ;      
        this.setState(newState);
    }
    handleLocation = async(locationName) =>{
        console.log("h location",locationName);
        let result = await axios.get(`http://localhost:8000/viewPage/locationFilter?lname=${locationName}&tag=${this.state.sarchText}`);
        let newState = {...this.state};
        newState.dataAry = this.handleListSort(this.state.listSort,result.data);
        newState.location = locationName ; 
        console.log(newState);
        this.setState(newState);
    } 
    handleSarchText = async(sarchText) =>{
        console.log("關鍵字:",sarchText);
        let result = await axios.get(`http://localhost:8000/viewPage/locationFilter?lname=${this.state.location}&tag=${sarchText}`);
        let newState = {...this.state};
        newState.dataAry = this.handleListSort(this.state.listSort,result.data);
        newState.sarchText = sarchText;    
        console.log(newState);     
        this.setState(newState);
    }
  

}

//整頁viewPage
class viewPage extends React.Component{
    state = {};
    
    render(){ 
        let location = this.props.match.params.location ;
        let loginUid = this.props.userId ; 
        if(!location){
            location = '所有地區';
        }
        console.log("location:",location);
        console.log("loginUid:",loginUid);
        return(
            <React.Fragment>
                <Container loginUid={loginUid}
                           location={location}
                />  
            </React.Fragment>
        );
    }   
}


export default viewPage;