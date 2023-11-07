
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.lrc-list'),
    container: document.querySelector('.container'),
};

/**
 * 解析歌詞字符串
 * 得到一個歌詞對象數組
 * 每個單詞對象:
 * {time: 開始時間,words: 歌詞內容}
 */
function parseLrc(){
    let result = [];
    let lines = listl.split('\n');

    for(let i=0;i<lines.length;i++){
        let str = lines[i];
        let parStr = str.split("]");
        let timerStr = parStr[0].substring(1);

        let timer = timerStr.split(":");

        let obj = {
            time: +timer[0]*60 + +timer[1]*60 + +timer[2],
            words: parStr[1],
        }
        
        result.push(obj);
    }
    return result;
};

let lrcData = parseLrc();

/**
 * 計算出，當前撥放器撥放到第幾秒的情況下
 * lrcData 數組中，應該高亮顯示的歌詞下標
 * 如果找不到要顯示歌詞，顯示 -1
 */
function findIndex(){
    // 撥放器當前時間
    let curTime = doms.audio.currentTime;
    let findLrcData = lrcData.findIndex((item,index) =>{
        return item.time > curTime;
    })-1;

    // 找遍了都找不到歌詞時
    return findLrcData<-1 ? lrcData.length-1 : findLrcData;

    // let cs = document.getElementsByClassName('lrc-list')[0];
    // for(let i =0; i<cs.children.length;i++){
    //     cs.children[i].className="";
    // }
    // cs.children[findLrcData].className="active";
    // return this.lrcData[findLrcData];

};

/** 
 * 顯示歌詞
 */
function createElent(){
    // 文檔片段
    let createLi = document.createDocumentFragment();

    lrcData.forEach(item =>{
        let li = document.createElement('li');
        li.textContent = item.words;
        createLi.appendChild(li);
    })
    doms.ul.appendChild(createLi);
}

createElent();

// 容器高度
let containerHeight = doms.container.clientHeight;
// li 高度
let liHeight = doms.ul.children[0].clientHeight;
// 最大偏移量
let maxOffset = doms.ul.clientHeight - containerHeight;

/**
 * 設置 ul 元素的偏移量
 */
function setOffSet(){

    let index = findIndex();
    let offset = liHeight * index + liHeight/2 - containerHeight/2;
    if(offset <0){
        offset = 0;
    }
    if(offset > maxOffset){
        offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;

    //去掉 之前的 active
    let li = doms.ul.querySelector('.active');
    if(li){
        li.classList.remove('active');
    }

    li = doms.ul.children[index];
    if(li){
        li.classList.add('active');
    }
    console.log(offset);
};

doms.audio.addEventListener('timeupdate',setOffSet)

