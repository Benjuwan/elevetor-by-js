document.addEventListener("DOMContentLoaded", ()=>{
    const floors = [1, 2, 3, 4, 5, 6, 7, 8];
    const floorHolder = document.querySelector('#myUl');
    floors.forEach((floor, i) => {
        if(!(i === 0)){
            floorHolder.insertAdjacentHTML('afterbegin', `<li class="floor-0${i+1}"><span>${floor}</span></li>`);
        } else {
            floorHolder.insertAdjacentHTML('afterbegin', `<li><span>${floor}</span></li>`);
        }
    });
    floorHolder.insertAdjacentHTML('beforeend', `<div class="staBox"><button>昇順</button><button>降順</button></div>`);
    const ascBtn = document.querySelector('.staBox button:first-of-type');
    const descBtn = document.querySelector('.staBox button:nth-of-type(2)');


    let floorBoxes = []; // エレベーターフロア・階数記録
    const actionElmLi = floorHolder.querySelectorAll('li'); // フロア・階数要素の<li>
    actionElmLi.forEach(li => {
        li.addEventListener('click',()=>{
            li.classList.add('now');
        });
        li.addEventListener('dblclick',()=>{
            if(li.classList.contains('now')){
                li.classList.remove('now');
            }
        });
    });

    // 特定のclass(targetClassName)を持つ、特定のNodeList(targetElm)の、特定の要素(elmItem)のみを、特定の配列(targetAry)へ格納
    function selectFloors(targetAry, targetElm, targetClassName){
        targetElm.forEach(elmItem => {
            if(elmItem.classList.contains(targetClassName)){
                targetAry.push(`floor-0${elmItem.textContent}`);
            }
        });
    }

    // 階数記録をソートした後、指定要素へ（加工した形で）class(.floor-0xxx)を付与する関数
    function SortMap(sortTarget){
        floorHolder.classList=""; // 追加classをクリアにしてから随時追加していく（移動のスタイルをあてるため）
        return sortTarget.map(getSort => {
            return `floor-0${getSort}`;
        });
    }

    function setFloors(target, judgeBtn){
        let counter = 0;

        function action(counter){
            let forSort = []; // ソート処理用の配列

            actionElmLi.forEach(li => {
                li.addEventListener('click', (e)=>{
                    if(floorBoxes.length > 0){ // 初期状態でのクリックイベントを防ぐための処理（*二重計測となって階数記録にクリック階数がダブって格納されていってしまうため）
                        if(!(floorBoxes.join('').match(e.target.textContent))){
                            // if：要素（配列を文字列に変換した階数記録）とクリックした階数の文字列とを照合してfalseの場合（階数記録にクリックした階数が含まれていない場合）は階数記録に追加
                            floorBoxes.push(`floor-0${e.target.textContent}`);
                            // console.log(floorBoxes);
                        } else {
                            // else：階数記録にクリックした階数が「含まれている（true の）」場合は階数をダブルクリックでキャンセル（階数記録から削除）
                            li.addEventListener('dblclick', (e)=>{
                                // console.log(floorBoxes); 
                                // filterで条件一致（クリックした階数の加工文字(文字列：floor-0xxx)に該当しない要素のみを返却した配列にする）による加工処理
                                floorBoxes = floorBoxes.filter(floorItem => {
                                    return floorItem !== `floor-0${e.target.textContent}`;
                                });
                                // console.log(floorBoxes);
                            });
                        }
                    }
                });
            });

            // 階数記録（配列）を加工（数値型へ変換した上で数字のみを抽出）してソート処理用の配列へ格納
            floorBoxes.forEach(box => {
                forSort.push(Number(box.split('-')[1]));
            });

            // エレベーターのスタートアクションの条件分岐（ボタンのテキストによって分岐）
            if(judgeBtn === '昇順'){
                const asc = forSort.sort((a,b)=>{
                    return a - b;
                });
                target.classList.add(SortMap(asc)[counter]);
                // console.log(`昇順：${asc}`);
            } else if(judgeBtn === '降順'){
                const desc = forSort.sort((a,b)=>{
                    return b - a;
                });
                target.classList.add(SortMap(desc)[counter]);
                // console.log(`降順：${desc}`);
            }

            counter++;

            if(counter <= floorBoxes.length){
                roopAct(counter);
            } else {
                setTimeout(()=>{
                    floorHolder.classList="";
                    actionElmLi.forEach(li => {
                        li.classList.remove('now');
                    });
                    floorBoxes = [];
                }, 1500);
            }
        }

        function roopAct(val){
            setTimeout(()=>{
                action(val);
            }, 1500);
        }

        action(counter);
    }

    // エレベーターのスタートアクション
    ascBtn.addEventListener('click',(e)=>{
        selectFloors(floorBoxes, actionElmLi, 'now');
        setFloors(floorHolder, e.target.textContent);
    });
    descBtn.addEventListener('click',(e)=>{
        selectFloors(floorBoxes, actionElmLi, 'now');
        setFloors(floorHolder, e.target.textContent);
    });

});