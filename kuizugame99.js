document.addEventListener("DOMContentLoaded", () => {
    /* ================================== */
    /* I. 画面遷移用 DOM 要素の定義 */
    /* ================================== */
    const topScreen = document.getElementById("top-screen");
    const selectionScreen = document.getElementById("selection-screen");
    const quizModeContainer = document.getElementById("quiz-mode-container"); 
    const gameContainer = document.getElementById("game-container");

    const startBtn = document.getElementById("start-button");
    const backFromSelectionToTopBtn = document.getElementById("back-to-selection-top-button");
    
    // クイズモードのナビゲーション
    const modeQuizBtn = document.getElementById("mode-quiz-button");
    const modeGameBtn = document.getElementById("mode-game-button");
    const backFromQuizModeBtn = document.getElementById("back-from-quiz-mode-button");
    const startQuizBtn = document.getElementById("start-quiz-button");
    const retryQuizBtn = document.getElementById("retry-quiz-button");
    const backToModeSelectionBtn = document.getElementById("back-to-mode-selection-button");
    // 追加: ゲームをやめるボタンのDOM要素を定義
    const quitGameButton = document.getElementById("quit-game-button");

    /* ================================== */
    /* II. クイズゲーム用 DOM 要素と状態変数 */
    /* ================================== */
    let currentQuizIndex = 0;
    let score = 0;
    let shuffledQuizzes = []; 

    const QUIZ_COUNT = 10; // 出題数を10問

    const quizStartScreen = document.getElementById('quiz-start-screen');
    const quizContainer = document.getElementById('quiz-container'); 
    const quizResultScreen = document.getElementById('quiz-result-screen'); 

    const totalQuestionsStart = document.getElementById('total-questions-start'); 
    const questionElement = document.getElementById('question');
    const choicesContainer = document.getElementById('choices-container');
    const resultMessage = document.getElementById('result-message');
    const scoreDisplay = document.getElementById('score-display');
    const totalQuestions = document.getElementById('total-questions');
    const nextButtonContainer = document.getElementById('next-button-container'); 
    const finalScore = document.getElementById('final-score');
    const finalTotal = document.getElementById('final-total');
    const rankMessage = document.getElementById('rank-message');
    const quizImage = document.getElementById('quiz-image'); 

    // 問題データの定義 (10問)
    const quizzes = [
        {
            question: "水害時避難する時に履くべき靴はどちらか？",
            choices: ["長靴", "スニーカー", "サンダル", "ハイヒール"],
            answer: "スニーカー",
            explanation: "長靴は浸水時に水が内部に入り、移動しづらくなってしまうため不適切です。ひもで結べて、足底がギザギザした滑りずらいスニーカーが避難時には適切です。",
            image: null
        },
        {
            question: "金沢市が作成している水害ハザードマップに書かれていないものは次のうちどれか？",
            choices: ["浸水想定区域", "警戒レベルごとに行うべき行動", "土砂災害想定区域", "高潮浸水想定区域図"],
            answer: "高潮浸水想定区域図",
            explanation: "水害ハザードマップは大雨により河川が氾濫した場合を想定したものなので、高潮に関する想定区域図はありません。",
            image: null
        },
        {
            question: "ハザードマップに記されている洪水の被害はどれくらいの規模を想定して作られているか？",
            choices: ["10年に1回", "100年に1回", "1000年以上に1回", "5000年以上に1回"],
            answer: "1000年以上に1回",
            explanation: "ハザードマップには１０００年以上に１回起こると考えられる洪水の被害が記されています。",
            image: null
        },
        {
            question: "災害前に用意するべきものとして間違っているものはどれか？",
            choices: ["非常用持ち出し袋の準備", "備蓄品の購入", "罹災（りさい）証明書の申請", "家族との連絡方法の確認"],
            answer: "罹災（りさい）証明書の申請",
            explanation: "罹災証明書の申請は、災害により家屋などに被害が出たことを証明する書類であり、災害後に自治体に申請する物なので間違いです。",
            image: null
        },
        {
            question: "災害時の非常食として適していないものはどれか？",
            choices: ["缶詰", "ビスケット", "カップ麺", "栄養補助食品"],
            answer: "カップ麺",
            explanation: "カップ麺はお湯を沸かして食べる必要があり、災害時はお湯を沸かすのはもちろん、水すら十分に入手することが難しい恐れがあるため不適です。",
            image: null
        },
        {
            question: "警戒レベルは5段階あるが、全員が避難するべき警戒レベルはどれか？",
            choices: ["レベル3", "レベル4", "レベル5", "レベル1"],
            answer: "レベル4",
            explanation: "警戒レベル5は避難行動が既に行えない状態を示しているため、レベル4のタイミングで避難行動を行わなければなりません。高齢者などの避難行動に時間がかかる人は警戒レベル3のタイミングで行う必要があります。",
            image: null
        },
        {
            question: "水圧により成人男性が扉を開けられなくなるのはどれくらいの水位からか？",
            choices: ["10cm", "30cm", "50cm", "80cm"],
            answer: "50cm",
            explanation: "20～30cmでドアにかかる水圧は数十キロになり女性や高齢者では開けられなくなり、50cmを超えると100キロ以上になり男性でも開けることは不可能になります。",
            image: null
        },
        {
            question: "水害発生時、山へ逃げるために車を使い避難行動することは〇か×か？",
            choices: ["〇（適切）", "×（不適切）"],
            answer: "×（不適切）",
            explanation: "災害時車を利用すると渋滞や事故の元になり、緊急車両の通行が困難になる恐れがあります。また、水害では30cm浸かる状態でエンジンが停止してしまい避難行動すらできなくなるため不適切です。",
            image: null
        },
        {
            question: "家屋が被災した時にすぐに確認すべき、火災・爆発の危険がある重要な項目はどれか？",
            choices: ["被害状況を写真で記録すること", "ブレーカーとガスの安全確認", "避難所への場所の確認", "近隣住民の安否確認"],
            answer: "ブレーカーとガスの安全確認",
            explanation: "特にブレーカー（電気）やガスに異常があると発火や爆発の恐れがあるため、迅速に安全確認を行う必要があります。",
            image: null
        },
        {
            question: "電気を復旧させるときの手順として正しい並び替えはどれか？ (画像参照)",
            choices: ["4→2→3→1", "2→3→1→4", "4→3→2→1", "2→4→3→1"],
            answer: "4→2→3→1",
            explanation: "正解は 4.ブレーカーが全てOFFになっているか確認 → 2.アンペアブレーカーをON → 3.漏電遮断器をON → 1.安全ブレーカーを一つずつON の順序です。",
            image: "kuizugamedetsukauyatsu.png" 
        }
    ];

    totalQuestions.textContent = QUIZ_COUNT; 
    totalQuestionsStart.textContent = QUIZ_COUNT; 
    
    // ボディ全体に適用される要素を取得
    const body = document.body; 

    /* ================================== */
    /* VI. リアルタイム時刻表示 & テーマ更新 */
    /* ================================== */
    
    // 画面右上に時刻を表示するコンテナを動的に作成
    function createTimeDisplay() {
        let timeDisplay = document.getElementById('current-time-display');
        if (!timeDisplay) {
            timeDisplay = document.createElement('div');
            timeDisplay.id = 'current-time-display';
            body.appendChild(timeDisplay);
        }
        return timeDisplay;
    }

    const timeDisplayElement = createTimeDisplay();
    
    function updateTimeAndTheme() {
        const now = new Date();
        const hour = now.getHours(); // 0 から 23
        const minute = String(now.getMinutes()).padStart(2, '0');
        const formattedTime = `${hour}:${minute}`;
        
        timeDisplayElement.textContent = formattedTime;

        // 昼間 (6:00 から 17:59) は light-theme (明るいテーマ)
        if (hour >= 6 && hour < 18) {
            body.classList.add('light-theme');
        } else {
            // 夜間 (18:00 から 5:59) は dark-theme (暗いテーマ)
            body.classList.remove('light-theme');
        }
    }

    // 初期ロード時に更新し、1分ごとにチェック
    updateTimeAndTheme();
    setInterval(updateTimeAndTheme, 60000); // 1分ごとにテーマをチェック・更新

    /* ================================== */
    /* III. 画面遷移 ロジック */
    /* ================================== */

    // スタートボタン -> 選択画面
    if (startBtn)
        startBtn.addEventListener("click", () => {
            topScreen.classList.add("hidden");
            selectionScreen.classList.remove("hidden");
        });

    // 選択画面 -> トップ画面
    if (backFromSelectionToTopBtn)
        backFromSelectionToTopBtn.addEventListener("click", () => {
            selectionScreen.classList.add("hidden");
            topScreen.classList.remove("hidden");
        });

    // クイズモードボタン -> クイズモードの開始画面
    if (modeQuizBtn)
        modeQuizBtn.addEventListener("click", () => {
            selectionScreen.classList.add("hidden");
            quizModeContainer.classList.remove("hidden");
            quizStartScreen.classList.remove('hidden');
            quizContainer.classList.add('hidden');
            quizResultScreen.classList.add('hidden');
        });

    // ゲームモードボタン -> ゲームモード画面（未実装）
    if (modeGameBtn)
        modeGameBtn.addEventListener("click", () => {
            selectionScreen.classList.add("hidden");
            gameContainer.classList.remove("hidden");
        });

    // クイズモード/ゲームモード -> 選択画面に戻る
    [backFromQuizModeBtn, document.getElementById("back-from-game-button")].forEach(btn => {
        if(btn) {
            btn.addEventListener("click", () => {
                quizModeContainer.classList.add("hidden");
                gameContainer.classList.add("hidden");
                selectionScreen.classList.remove("hidden");
            });
        }
    });

    // クイズスタートボタン -> クイズ本体開始
    if (startQuizBtn)
        startQuizBtn.addEventListener('click', startQuiz);
    
    // クイズ結果画面 -> モード選択に戻る
    if(backToModeSelectionBtn)
        backToModeSelectionBtn.addEventListener('click', () => {
            quizResultScreen.classList.add('hidden');
            quizModeContainer.classList.add('hidden');
            selectionScreen.classList.remove('hidden');
        });

    // クイズ結果画面 -> もう一度チャレンジ
    if(retryQuizBtn)
        retryQuizBtn.addEventListener('click', () => {
            quizResultScreen.classList.add('hidden');
            startQuiz(); // クイズを初期化して再開
        });

    // 追加: ゲームをやめるボタンのイベントリスナー
    if(quitGameButton)
        quitGameButton.addEventListener('click', () => {
            // ここに遷移したいURLを指定
            window.location.href = "https://www.pref.ishikawa.lg.jp/bousai/h_map.html"; // 例として石川県のハザードマップURL
        });


    /* ================================== */
    /* IV. クイズゲーム ロジック */
    /* ================================== */

    // 配列をシャッフルする関数 
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // クイズを開始する関数
    function startQuiz() {
        const allShuffled = shuffleArray([...quizzes]);
        shuffledQuizzes = allShuffled.slice(0, QUIZ_COUNT); 

        currentQuizIndex = 0;
        score = 0;
        scoreDisplay.textContent = score;

        quizStartScreen.classList.add('hidden');
        quizContainer.classList.remove('hidden');

        displayQuiz();
    }

    // 問題を表示する関数
    function displayQuiz() {
        resultMessage.textContent = "";
        nextButtonContainer.innerHTML = ""; 
        
        if (currentQuizIndex >= shuffledQuizzes.length) {
            showFinalResult();
            return;
        }

        const currentQuiz = shuffledQuizzes[currentQuizIndex]; 
        
        // 問題番号 (Q〇.) を削除
        questionElement.textContent = currentQuiz.question; 

        // 画像の表示/非表示処理
        if (currentQuiz.image) {
            quizImage.src = currentQuiz.image;
            quizImage.classList.remove('hidden');
        } else {
            quizImage.src = '';
            quizImage.classList.add('hidden');
        }

        choicesContainer.innerHTML = '';

        const shuffledChoices = shuffleArray([...currentQuiz.choices]); 

        shuffledChoices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choice-button');
            button.classList.add('action-button'); 
            
            button.addEventListener('click', () => {
                checkAnswer(button, choice, currentQuiz.answer);
            });

            choicesContainer.appendChild(button);
        });
    }

    // 正誤判定と次の問題への遷移
    function checkAnswer(selectedButton, selectedChoice, correctAnswer) {
        const buttons = choicesContainer.querySelectorAll('.choice-button');
        buttons.forEach(btn => btn.disabled = true);

        const currentQuiz = shuffledQuizzes[currentQuizIndex];
        
        // 選択肢のテキストと正解テキストが一致するか確認
        if (selectedChoice === currentQuiz.answer) { 
            resultMessage.innerHTML = `✅ 正解！ にげまくりまっし！<br><small>【解説】${currentQuiz.explanation}</small>`;
            selectedButton.classList.add('correct');
            score++;
        } else {
            resultMessage.innerHTML = `❌ 不正解... <small>正解は「${currentQuiz.answer}」でした。</small><br><small>【解説】${currentQuiz.explanation}</small>`;
            selectedButton.classList.add('incorrect');
            
            buttons.forEach(btn => {
                if (btn.textContent === currentQuiz.answer) {
                    btn.classList.add('correct');
                }
            });
        }
        
        scoreDisplay.textContent = score;

        // 次へボタンを生成・表示
        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-button';
        nextBtn.classList.add('action-button');
        nextBtn.textContent = (currentQuizIndex + 1) === QUIZ_COUNT ? '結果を見る' : '次へ'; 
        
        nextBtn.addEventListener('click', () => {
            resultMessage.textContent = "";
            nextButtonContainer.innerHTML = ""; 
            
            currentQuizIndex++;
            displayQuiz();
        });

        nextButtonContainer.appendChild(nextBtn);
    }

    // 最終結果の表示
    function showFinalResult() {
        quizContainer.classList.add('hidden');
        quizResultScreen.classList.remove('hidden');

        finalScore.textContent = score;
        finalTotal.textContent = QUIZ_COUNT; 
        
        const percentage = (score / QUIZ_COUNT) * 100;

        if (percentage === 100) {
            rankMessage.textContent = "🏆 完璧！あなたは防災マスターです！";
        } else if (percentage >= 70) {
            rankMessage.textContent = "✨ 素晴らしい！基本的な知識はバッチリです。";
        } else if (percentage >= 50) {
            rankMessage.textContent = "💡 まずまずです。さらに知識を深めましょう。";
        } else {
            rankMessage.textContent = "😥 要注意！もう一度しっかりと知識を身につけましょう。";
        }
    }

});