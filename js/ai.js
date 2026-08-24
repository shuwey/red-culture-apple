/* ============================================================
   AI 助手 · 小红（增强版）
   - 自带样式、浮动按钮、聊天面板
   - 从 data/*.js 动态构建知识库
   - 支持关键词匹配、别名扩展、动态搜索推荐
   ============================================================ */
(function () {
  /* ---- 自包含样式 ---- */
  var st = document.createElement('style');
  st.textContent =
    '.ai-fab{position:fixed;right:26px;bottom:26px;z-index:9000;width:58px;height:58px;border-radius:50%;border:none;' +
    'background:linear-gradient(135deg,#ffd857,#e6a70c);font-size:24px;cursor:pointer;' +
    'box-shadow:0 10px 26px rgba(0,0,0,.45);transition:.3s;display:flex;align-items:center;justify-content:center;}' +
    '.ai-fab:hover{transform:translateY(-3px) scale(1.05);}' +
    '.ai-fab .pulse{position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(255,207,51,.5);animation:aiPulse 2s ease-out infinite;}' +
    '@keyframes aiPulse{0%{transform:scale(1);opacity:.7;}100%{transform:scale(1.4);opacity:0;}}' +
    '.ai-panel{position:fixed;right:26px;bottom:96px;z-index:9000;width:min(360px,calc(100vw - 40px));height:480px;' +
    'background:linear-gradient(170deg,#6b0d0d,#3d0404);border:1px solid rgba(255,207,51,.4);border-radius:20px;' +
    'display:none;flex-direction:column;overflow:hidden;box-shadow:0 26px 60px rgba(0,0,0,.6);' +
    'font-family:"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif;animation:aiSlideUp .3s ease;}' +
    '@keyframes aiSlideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}' +
    '.ai-panel.show{display:flex;}' +
    '.ai-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;' +
    'border-bottom:1px solid rgba(255,207,51,.25);}' +
    '.ai-head .t{color:#ffd857;font-size:15px;letter-spacing:1px;font-weight:700;}' +
    '.ai-head .s{font-size:11px;color:rgba(255,220,150,.55);margin-top:2px;}' +
    '.ai-head button{background:none;border:none;color:rgba(255,220,150,.7);font-size:18px;cursor:pointer;padding:4px 8px;}' +
    '.ai-head button:hover{color:#ffd857;}' +
    '.ai-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}' +
    '.ai-body::-webkit-scrollbar{width:6px;}' +
    '.ai-body::-webkit-scrollbar-thumb{background:rgba(255,207,51,.3);border-radius:3px;}' +
    '.ai-msg{max-width:88%;padding:10px 14px;border-radius:13px;font-size:13.5px;line-height:1.75;word-break:break-word;}' +
    '.ai-msg.bot{align-self:flex-start;background:rgba(0,0,0,.32);border:1px solid rgba(255,207,51,.2);color:#f5e9d0;}' +
    '.ai-msg.user{align-self:flex-end;background:linear-gradient(135deg,#f0c22e,#d99a12);color:#4a2800;}' +
    '.ai-msg a{color:#ffd857;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(255,207,51,.4);}' +
    '.ai-msg a:hover{text-decoration:underline;}' +
    '.ai-quick{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px;border-top:1px solid rgba(255,207,51,.15);}' +
    '.ai-quick button{padding:5px 12px;border-radius:999px;border:1px solid rgba(255,207,51,.35);' +
    'background:rgba(0,0,0,.25);color:rgba(255,220,150,.85);font-size:12px;cursor:pointer;transition:.2s;}' +
    '.ai-quick button:hover{background:rgba(255,207,51,.18);border-color:#ffd857;color:#ffd857;}' +
    '.ai-input{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,207,51,.2);}' +
    '.ai-input input{flex:1;height:38px;border-radius:999px;border:1px solid rgba(255,207,51,.3);' +
    'background:rgba(0,0,0,.35);color:#ffe9b0;padding:0 14px;font-size:13px;outline:none;transition:.2s;}' +
    '.ai-input input:focus{border-color:#ffd857;box-shadow:0 0 0 3px rgba(255,207,51,.12);}' +
    '.ai-input input::placeholder{color:rgba(255,233,176,.4);}' +
    '.ai-input button{height:38px;padding:0 16px;border-radius:999px;border:none;' +
    'background:linear-gradient(135deg,#f0c22e,#c98a0a);color:#4a2800;font-size:13px;font-weight:700;cursor:pointer;transition:.2s;}' +
    '.ai-input button:hover{transform:translateY(-1px);}' +
    '.ai-privacy{padding:8px 14px 0;font-size:11px;color:rgba(255,220,150,.55);text-align:center;line-height:1.5;}' +
    '.ai-typing{display:flex;gap:4px;padding:10px 14px;}' +
    '.ai-typing span{width:8px;height:8px;border-radius:50%;background:rgba(255,207,51,.5);animation:aiTyping 1.4s infinite;}' +
    '.ai-typing span:nth-child(2){animation-delay:.2s;}' +
    '.ai-typing span:nth-child(3){animation-delay:.4s;}' +
    '@keyframes aiTyping{0%,60%,100%{opacity:.3;transform:scale(.8);}30%{opacity:1;transform:scale(1.2);}}' +
    '.ai-tip{position:fixed;right:26px;bottom:90px;max-width:220px;padding:8px 12px;background:rgba(0,0,0,.75);color:#ffd857;font-size:13px;line-height:1.4;border-radius:10px;border:1px solid rgba(255,207,51,.4);box-shadow:0 4px 12px rgba(0,0,0,.35);opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s;pointer-events:none;z-index:9001;}' +
    '.ai-tip.show{opacity:1;transform:translateY(0);}' +
    '@media (max-width:720px){.ai-panel{right:12px;bottom:86px;}.ai-fab{right:14px;bottom:16px;}.ai-tip{right:14px;bottom:80px;font-size:12px;}}';
  document.head.appendChild(st);

  /* ---- DOM 构建 ---- */
  ['aiFab', 'aiPanel'].forEach(function (id) {
    var e = document.getElementById(id);
    if (e) e.remove();
  });

  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<button class="ai-fab" id="aiFab" title="有事问小红" aria-label="打开 AI 助手小红"><span class="pulse"></span>💬</button>' +
    '<div class="ai-tip" id="aiTip" role="tooltip">我是 AI 小红，有问题随时问我</div>' +
    '<div class="ai-panel" id="aiPanel" role="dialog" aria-modal="true" aria-label="AI 助手小红">' +
      '<div class="ai-head">' +
        '<div><div class="t">有事问小红</div><div class="s">AI 助手 · 小红</div></div>' +
        '<button id="aiClose" aria-label="关闭面板">✕</button>' +
      '</div>' +
      '<div class="ai-body" id="aiBody" aria-live="polite" aria-atomic="false"></div>' +
      '<div class="ai-quick" id="aiQuick"></div>' +
      '<div class="ai-privacy">为持续改进回答质量，你的提问与回复会被匿名记录。</div>' +
      '<div class="ai-input">' +
        '<input type="text" id="aiText" placeholder="向小红提问..." aria-label="提问">' +
        '<button id="aiSend">发送</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var fab = document.getElementById('aiFab'),
      panel = document.getElementById('aiPanel'),
      aiTip = document.getElementById('aiTip'),
      aiBody = document.getElementById('aiBody'),
      aiText = document.getElementById('aiText'),
      aiQuick = document.getElementById('aiQuick');

  /* ---- 知识库 ---- */
  var KB = [];
  var kbReady = false;
  var lastTopic = null; // 记录上次匹配到的主题，用于上下文

  function heroUrl(id) { return 'detail.html?type=hero&id=' + id; }
  function placeUrl(id) { return 'detail.html?type=place&id=' + id; }
  function eventUrl(id) { return 'detail.html?type=event&id=' + id; }

  function buildKB() {
    KB = [];
    // 英雄人物
    if (typeof HEROES !== 'undefined' && Array.isArray(HEROES)) {
      HEROES.forEach(function (h) {
        var desc = (h.h || h.s || '').replace(/\n/g, ' ');
        if (desc.length > 120) desc = desc.substring(0, 120) + '…';
        KB.push({
          k: [h.n, h.t, h.cat],
          type: 'hero',
          id: h.id,
          name: h.n,
          r: desc + ' 详见 <a href="' + heroUrl(h.id) + '">' + h.n + '事迹</a>。'
        });
      });
    }
    // 红色圣地
    if (typeof PLACES !== 'undefined' && Array.isArray(PLACES)) {
      PLACES.forEach(function (p) {
        var desc = (p.h || p.s || '').replace(/\n/g, ' ');
        if (desc.length > 120) desc = desc.substring(0, 120) + '…';
        KB.push({
          k: [p.n, p.t, p.cat],
          type: 'place',
          id: p.id,
          name: p.n,
          r: desc + ' 详见 <a href="' + placeUrl(p.id) + '">' + p.n + '导览</a>。'
        });
      });
    }
    // 历史事件
    if (typeof EVENTS !== 'undefined' && Array.isArray(EVENTS)) {
      EVENTS.forEach(function (e) {
        var desc = (e.h || e.s || '').replace(/\n/g, ' ');
        if (desc.length > 120) desc = desc.substring(0, 120) + '…';
        KB.push({
          k: [e.n, e.s, e.cat, String(e.yr)],
          type: 'event',
          id: e.id,
          name: e.n,
          r: desc + ' 详见 <a href="' + eventUrl(e.id) + '">' + e.n + '纪实</a>。'
        });
      });
    }

    var heroCount = (typeof HEROES !== 'undefined') ? HEROES.length : 20;
    var placeCount = (typeof PLACES !== 'undefined') ? PLACES.length : 12;
    var eventCount = (typeof EVENTS !== 'undefined') ? EVENTS.length : 13;

    // 通用高频问题
    KB.push({ k: ['英雄', '人物', '先烈'], r: '本站英雄人物库收录了毛泽东、刘胡兰、黄继光等' + heroCount + '位英雄模范，去 <a href="heroes.html">英雄人物库</a> 看看吧。' });
    KB.push({ k: ['地点', '圣地', '旧址', '遗址'], r: '红色地点板块收录了嘉兴南湖红船、井冈山、延安等' + placeCount + '处革命圣地，去 <a href="places.html">红色圣地</a> 看看。' });
    KB.push({ k: ['事件', '历史', '时间轴'], r: '历史事件板块梳理了从五四运动到改革开放的' + eventCount + '件大事，去 <a href="events.html">历史事件</a> 看看。' });
    KB.push({ k: ['考试', '答题', '测验', '考核', '题目', '徽章'], r: '主页的"红色知识考核"板块有45道题、4个难度、10个徽章等你挑战，回 <a href="quiz.html">主页</a> 试试你的红色知识储备吧。' });
    KB.push({ k: ['搜索', '检索', '查找'], r: '导航栏有全站搜索框，输入关键词即可检索站内全部英雄、圣地和事件。也可以到 <a href="search.html">搜索页</a> 查看。' });
    KB.push({ k: ['关于', '出处', '来源', '版权'], r: '关于本站的图片出处、史料来源和技术说明，请查看 <a href="about.html">关于/史料来源</a> 页面。' });

    // 主题别名
    KB.push({ k: ['五四', '1919'], r: '1919年五四运动是旧民主主义革命走向新民主主义革命的转折点，促进了马克思主义在中国的传播。详见 <a href="detail.html?type=event&id=8">五四运动纪实</a>。' });
    KB.push({ k: ['长征', '二万五千里'], r: '红军长征（1934—1936）纵横十余省、行程约二万五千里，1936年10月三大主力在会宁胜利会师。详见 <a href="detail.html?type=event&id=3">长征胜利纪实</a>。' });
    KB.push({ k: ['遵义'], r: '1935年1月召开的遵义会议是党的历史上生死攸关的转折点。详见 <a href="detail.html?type=event&id=4">遵义会议纪实</a> 和 <a href="detail.html?type=place&id=3">遵义会议旧址导览</a>。' });
    KB.push({ k: ['井冈山'], r: '井冈山是中国第一个农村革命根据地，"星星之火，可以燎原"。详见 <a href="detail.html?type=place&id=2">井冈山导览</a> 和 <a href="detail.html?type=event&id=9">井冈山会师</a>。' });
    KB.push({ k: ['延安'], r: '延安是中国革命圣地，党中央在此生活战斗了十三年，孕育了伟大的延安精神。详见 <a href="detail.html?type=place&id=4">延安导览</a>。' });
    KB.push({ k: ['西柏坡'], r: '西柏坡是"进京赶考"出发地，三大战役在此指挥，"新中国从这里走来"。详见 <a href="detail.html?type=place&id=5">西柏坡导览</a>。' });
    KB.push({ k: ['红船', '南湖', '嘉兴', '建党', '一大'], r: '嘉兴南湖红船是党的诞生地。1921年中共一大在这艘游船上闭幕，中国共产党宣告成立。详见 <a href="detail.html?type=place&id=1">红船导览</a> 和 <a href="detail.html?type=event&id=1">中共一大纪实</a>。' });
    KB.push({ k: ['南昌', '八一', '建军'], r: '1927年8月1日南昌起义打响了武装反抗国民党反动派的第一枪，8月1日由此成为建军节。详见 <a href="detail.html?type=event&id=2">南昌起义纪实</a>。' });
    KB.push({ k: ['瑞金'], r: '瑞金是红色故都、共和国摇篮，1931年中华苏维埃共和国临时中央政府在此成立。详见 <a href="detail.html?type=place&id=6">瑞金导览</a>。' });
    KB.push({ k: ['古田'], r: '1929年古田会议确立了思想建党、政治建军的原则。详见 <a href="detail.html?type=event&id=10">古田会议纪实</a> 和 <a href="detail.html?type=place&id=8">古田会议旧址</a>。' });
    KB.push({ k: ['百色'], r: '1929年百色起义由邓小平、张云逸等领导，在右江地区树起工农武装割据旗帜。详见 <a href="detail.html?type=event&id=11">百色起义纪实</a>。' });
    KB.push({ k: ['会宁', '会师'], r: '1936年10月红军三大主力在甘肃会宁胜利会师，标志着长征胜利结束。详见 <a href="detail.html?type=place&id=10">会宁会师旧址</a>。' });
    KB.push({ k: ['韶山'], r: '韶山是毛泽东同志的故乡，从韶山冲走出的少年最终成为改变中国命运的伟大领袖。详见 <a href="detail.html?type=place&id=11">韶山导览</a>。' });
    KB.push({ k: ['瓦窑堡'], r: '1935年瓦窑堡会议确定了建立抗日民族统一战线的新策略。详见 <a href="detail.html?type=place&id=12">瓦窑堡会议旧址</a>。' });
    KB.push({ k: ['开国', '新中国成立', '国庆', '1949'], r: '1949年10月1日开国大典在天安门举行，毛泽东主席庄严宣告中华人民共和国成立。详见 <a href="detail.html?type=event&id=7">开国大典纪实</a>。' });
    KB.push({ k: ['抗战', '抗日战争', '抗日'], r: '中国人民抗日战争是近代以来反侵略战争的第一次完全胜利。详见 <a href="detail.html?type=event&id=5">抗日战争胜利纪实</a>。' });
    KB.push({ k: ['三大战役', '辽沈', '淮海', '平津'], r: '1948年9月至1949年1月，辽沈、淮海、平津三大战役共歼灭和改编国民党军154万余人。详见 <a href="detail.html?type=event&id=6">三大战役纪实</a>。' });
    KB.push({ k: ['抗美援朝', '志愿军', '朝鲜'], r: '1950年中国人民志愿军跨过鸭绿江入朝参战，彭德怀任司令员。黄继光、邱少云等英雄儿女用鲜血铸就了"最可爱的人"丰碑。详见 <a href="detail.html?type=event&id=12">抗美援朝纪实</a>。' });
    KB.push({ k: ['改革开放', '三中全会', '1978'], r: '1978年党的十一届三中全会作出了改革开放的历史性决策，实现了伟大历史性转折。详见 <a href="detail.html?type=event&id=13">改革开放纪实</a>。' });
    KB.push({ k: ['谢谢', '感谢', '多谢'], r: '不客气！传承红色基因，赓续精神血脉，我们一起努力。' });
    KB.push({ k: ['你好', '您好', 'hi', 'hello', '在吗'], r: '你好呀！我是小红，站内' + heroCount + '位英雄人物、' + placeCount + '处红色圣地、' + eventCount + '个历史事件都可以问我，比如"毛泽东是谁""介绍一下长征""井冈山在哪里"。' });
    KB.push({ k: ['你是谁', '你是'], r: '你好呀！我是 AI 助手小红，专门为你解答红色文化、党史军史相关问题，欢迎随时提问。' });
    KB.push({ k: ['毛泽东', '毛主席'], r: '毛泽东同志（1893—1976）是中国共产党、中国人民解放军和中华人民共和国的主要创立者，领导中国人民从此站起来了。详见 <a href="detail.html?type=hero&id=1">毛泽东事迹</a>。' });
    KB.push({ k: ['刘胡兰'], r: '刘胡兰（1932—1947）面对敌人铡刀坚贞不屈，牺牲时年仅15岁，毛泽东题词"生的伟大，死的光荣"。详见 <a href="detail.html?type=hero&id=6">刘胡兰事迹</a>。' });
    KB.push({ k: ['黄继光'], r: '黄继光（1931—1952）在上甘岭战役中用胸膛堵住敌人机枪射口，壮烈牺牲，年仅21岁。详见 <a href="detail.html?type=hero&id=19">黄继光事迹</a>。' });
    KB.push({ k: ['邱少云'], r: '邱少云（1926—1952）在潜伏中烈火烧身纹丝不动，以钢铁般的纪律守护了整支潜伏部队。详见 <a href="detail.html?type=hero&id=20">邱少云事迹</a>。' });
    KB.push({ k: ['周恩来', '周总理'], r: '周恩来同志（1898—1976）是中华人民共和国第一任国务院总理，一生鞠躬尽瘁，被誉为"人民的好总理"。详见 <a href="detail.html?type=hero&id=2">周恩来事迹</a>。' });
    KB.push({ k: ['彭德怀'], r: '彭德怀同志（1898—1974）是开国元帅、抗美援朝志愿军司令员，"谁敢横刀立马？唯我彭大将军！"详见 <a href="detail.html?type=hero&id=5">彭德怀事迹</a>。' });

    kbReady = true;
  }

  /* ---- 按需加载数据文件 ---- */
  function ensureData(callback) {
    var need = [];
    if (typeof HEROES === 'undefined') need.push('data/heroes.js');
    if (typeof PLACES === 'undefined') need.push('data/places.js');
    if (typeof EVENTS === 'undefined') need.push('data/events.js');
    if (typeof EXTERNAL_SOURCES === 'undefined') need.push('data/external-sources.js');
    if (!need.length) { callback(); return; }
    var loaded = 0;
    need.forEach(function (src) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { if (++loaded === need.length) callback(); };
      s.onerror = function () { if (++loaded === need.length) callback(); };
      document.head.appendChild(s);
    });
  }

  /* ---- 快捷问题 ---- */
  var quickTags = ['毛泽东', '长征', '井冈山', '延安', '遵义会议', '开国大典', '刘胡兰', '抗美援朝'];
  function renderQuick() {
    aiQuick.innerHTML = quickTags.map(function (q) {
      return '<button data-q="' + q + '">' + q + '</button>';
    }).join('');
    aiQuick.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON') {
        aiText.value = e.target.getAttribute('data-q');
        send();
      }
    });
  }

  /* ---- 消息渲染 ---- */
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function push(html, who) {
    var d = document.createElement('div');
    d.className = 'ai-msg ' + who;
    // 用户输入需要转义，防止 XSS；机器人回复来自受控静态数据，保持 HTML 链接
    d.innerHTML = who === 'user' ? escapeHtml(html) : html;
    aiBody.appendChild(d);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  function pushTyping() {
    var d = document.createElement('div');
    d.className = 'ai-typing';
    d.id = 'aiTyping';
    d.innerHTML = '<span></span><span></span><span></span>';
    aiBody.appendChild(d);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById('aiTyping');
    if (t) t.remove();
  }

  function findByName(name) {
    var q = name.toLowerCase();
    var all = [];
    if (typeof HEROES !== 'undefined') all = all.concat(HEROES.map(function (h) { return { type: 'hero', item: h }; }));
    if (typeof PLACES !== 'undefined') all = all.concat(PLACES.map(function (p) { return { type: 'place', item: p }; }));
    if (typeof EVENTS !== 'undefined') all = all.concat(EVENTS.map(function (e) { return { type: 'event', item: e }; }));
    return all.filter(function (x) {
      return (x.item.n && x.item.n.toLowerCase().indexOf(q) !== -1) ||
             (x.item.t && x.item.t.toLowerCase().indexOf(q) !== -1) ||
             (x.item.s && x.item.s.toLowerCase().indexOf(q) !== -1);
    });
  }

  function buildSearchLink(q) {
    return ' <a href="search.html?q=' + encodeURIComponent(q) + '">去搜索</a>';
  }

  function fallbackReply(v) {
    // 尝试在实体数据中模糊查找
    var hits = findByName(v);
    if (hits.length > 0) {
      var top = hits.slice(0, 4);
      var list = top.map(function (x) {
        var item = x.item;
        var url = x.type === 'hero' ? heroUrl(item.id) : x.type === 'place' ? placeUrl(item.id) : eventUrl(item.id);
        return '• <a href="' + url + '">' + item.n + '</a>';
      }).join('<br>');
      return '你可能想了解：<br>' + list + '<br>也可以到 <a href="search.html?q=' + encodeURIComponent(v) + '">搜索页</a> 继续查找。';
    }
    return '这个问题我还在学习中。你可以问我任何一位英雄（如"毛泽东""刘胡兰"）、红色地点（如"井冈山""延安"）或历史事件（如"长征""遵义会议"），也可以到 <a href="search.html?q=' + encodeURIComponent(v) + '">搜索页</a> 试试。';
  }

  // 站外权威史料来源 fallback
  function externalReply(q) {
    var lower = q.toLowerCase().replace(/[？?]/g, '');
    // 通用虚词，不应作为匹配依据
    var STOP_WORDS = { '是': 1, '是谁': 1, '什么': 1, '怎么': 1, '为什么': 1, '如何': 1, '哪些': 1, '哪个': 1, '怎样': 1, '吗': 1, '呢': 1 };

    // 1. 优先匹配预置的简要问答
    if (typeof EXTERNAL_QA !== 'undefined' && Array.isArray(EXTERNAL_QA)) {
      var bestQA = null, bestQAScore = 0;
      // 特殊处理 "X是谁" 问法：优先找 q 字段中 "X是谁"
      var whoMatch = lower.match(/^(.*?)是(?:谁|什么)$/);
      var whoName = whoMatch ? whoMatch[1].trim() : '';

      EXTERNAL_QA.forEach(function (qa) {
        var score = 0;
        var qaQ = (qa.q || '').toLowerCase().replace(/[？?]/g, '');
        // 问题文本高度匹配
        if (qaQ === lower) { score = 200; }
        else if (whoName && qaQ === whoName + '是谁') { score = 180; }
        else if (qaQ.indexOf(lower) !== -1) { score = Math.max(score, 80); }
        else if (lower.indexOf(qaQ) !== -1) { score = Math.max(score, 70); }

        // 关键词匹配
        qa.keywords.forEach(function (kw) {
          kw = kw.toLowerCase().replace(/[？?]/g, '');
          if (!kw || STOP_WORDS[kw]) return;
          if (lower === kw) { score = Math.max(score, 100); }
          else if (lower.indexOf(kw) !== -1) { score = Math.max(score, kw.length * 2 + 10); }
          else if (kw.indexOf(lower) !== -1) { score = Math.max(score, kw.length); }
        });

        if (score > bestQAScore) { bestQAScore = score; bestQA = qa; }
      });
      if (bestQAScore >= 2 && bestQA) {
        var link = bestQA.url ? ' 详情可查看 <a href="' + bestQA.url + '" target="_blank" rel="noopener">' + bestQA.source + '：' + bestQA.q + '</a>。' : '（来源：' + bestQA.source + '）';
        return bestQA.answer + link;
      }
    }

    // 2. 否则按权威来源做关键词推荐
    var best = null, bestScore = 0;
    if (typeof EXTERNAL_SOURCES !== 'undefined' && Array.isArray(EXTERNAL_SOURCES)) {
      EXTERNAL_SOURCES.forEach(function (src) {
        var score = 0;
        src.keywords.forEach(function (kw) {
          kw = kw.toLowerCase();
          if (lower === kw) { score = Math.max(score, 100); }
          else if (lower.indexOf(kw) !== -1) { score = Math.max(score, kw.length * 2); }
          else if (kw.indexOf(lower) !== -1) { score = Math.max(score, kw.length); }
        });
        if (score > bestScore) { bestScore = score; best = src; }
      });
    }

    if (bestScore >= 2 && best) {
      return '这个问题目前超出了本站收录范围，建议你参考 <b>' + best.name + '</b>（' + best.source + '）：' + best.desc +
             ' → <a href="' + best.url + '" target="_blank" rel="noopener">点击访问</a>';
    }

    // 3. 再尝试推荐相关书籍
    if (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) {
      var bestBook = null, bestBookScore = 0;
      BOOKS.forEach(function (book) {
        var score = 0;
        book.keywords.forEach(function (kw) {
          kw = kw.toLowerCase();
          if (lower === kw) { score = Math.max(score, 100); }
          else if (lower.indexOf(kw) !== -1) { score = Math.max(score, kw.length * 2); }
          else if (kw.indexOf(lower) !== -1) { score = Math.max(score, kw.length); }
        });
        if (score > bestBookScore) { bestBookScore = score; bestBook = book; }
      });
      if (bestBookScore >= 2 && bestBook) {
        return '这个问题我目前只能给你推荐一本相关读物：' + bestBook.title + '（' + bestBook.author + '，' + bestBook.publisher + '）。' +
               bestBook.desc;
      }
    }

    return '这个问题我暂时帮不上。你可以尝试在 <a href="https://cpc.people.com.cn/" target="_blank" rel="noopener">中国共产党新闻网</a>、' +
           '<a href="https://www.81.cn/" target="_blank" rel="noopener">中国军网</a>、' +
           '<a href="https://www.xuexi.cn/" target="_blank" rel="noopener">学习强国</a> 等权威平台搜索更详细的资料。';
  }

  function match(q) {
    var lower = q.toLowerCase();
    var best = null, bestScore = 0;

    for (var i = 0; i < KB.length; i++) {
      var item = KB[i];
      var score = 0;
      for (var j = 0; j < item.k.length; j++) {
        var kw = item.k[j].toLowerCase();
        if (!kw) continue;
        // 全词匹配权重更高
        if (lower === kw) { score = Math.max(score, 100); }
        else if (lower.indexOf(kw) !== -1) { score = Math.max(score, kw.length * 2); }
        else if (kw.indexOf(lower) !== -1) { score = Math.max(score, kw.length); }
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    return { item: best, score: bestScore };
  }

  function send() {
    var v = aiText.value.trim();
    if (!v) return;
    // 数据尚未加载时先加载，避免外部知识库为空
    if (!kbReady) {
      pushTyping();
      ensureData(function () {
        buildKB();
        removeTyping();
        send();
      });
      return;
    }
    push(v, 'user');
    aiText.value = '';
    pushTyping();
    setTimeout(function () {
      removeTyping();
      var result = match(v);
      var reply;
      if (result.item && result.score >= 2) {
        reply = result.item.r;
        lastTopic = { type: result.item.type, id: result.item.id, name: result.item.name };
      } else {
        // 上下文：如果上一条有主题，问"还有呢/继续"则展开
        if (lastTopic && /(还有|继续|再|详细|介绍一下)/.test(v)) {
          var url = lastTopic.type === 'hero' ? heroUrl(lastTopic.id) : lastTopic.type === 'place' ? placeUrl(lastTopic.id) : eventUrl(lastTopic.id);
          reply = '关于“' + lastTopic.name + '”的更多内容，请查看 <a href="' + url + '">' + lastTopic.name + '详情页</a>。';
        } else {
          reply = externalReply(v);
          lastTopic = null;
        }
      }
      push(reply, 'bot');
      logQA(v, reply);
    }, 500 + Math.random() * 300);
  }

  // 问答记录：匿名提交到 Netlify Forms，用于后续内容维护
  var logged = new Set();
  try {
    var cached = localStorage.getItem('ai-qa-last');
    if (cached) logged.add(cached);
  } catch (e) {}

  function logQA(q, a) {
    if (!q || !a) return;
    var key = (q + '|' + a).trim();
    if (logged.has(key)) return;

    var body = 'form-name=qa-log' +
      '&question=' + encodeURIComponent(q) +
      '&answer=' + encodeURIComponent(a.replace(/<[^>]+>/g, ' ')) +
      '&page=' + encodeURIComponent(location.href) +
      '&ts=' + encodeURIComponent(new Date().toISOString());

    fetch('about.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function () {
      logged.add(key);
      try { localStorage.setItem('ai-qa-last', key); } catch (e) {}
    }).catch(function () {});
  }

  /* ---- 事件绑定 ---- */
  var focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  function getPanelFocusables() {
    return Array.prototype.slice.call(panel.querySelectorAll(focusableSelector));
  }
  function trapFocus(e) {
    if (!panel.classList.contains('show')) return;
    var focusables = getPanelFocusables();
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first || !panel.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !panel.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }
  function openPanel() {
    panel.classList.add('show');
    if (aiTip) aiTip.classList.remove('show');
    stopTips();
    setTimeout(function () { aiText.focus(); }, 50);
  }
  function closePanel() {
    panel.classList.remove('show');
    if (fab) fab.focus();
  }

  fab.addEventListener('click', function () {
    var wasOpen = panel.classList.contains('show');
    if (wasOpen) {
      closePanel();
    } else {
      openPanel();
      if (!aiBody.children.length) {
        if (!kbReady) {
          pushTyping();
          ensureData(function () {
            buildKB();
            removeTyping();
            push('你好，我是AI助手小红！站内英雄人物、红色圣地、历史事件都可以问我，比如"毛泽东是谁""介绍一下长征""井冈山在哪里"。', 'bot');
          });
        } else {
          push('你好，我是AI助手小红！站内英雄人物、红色圣地、历史事件都可以问我，比如"毛泽东是谁""介绍一下长征""井冈山在哪里"。', 'bot');
        }
      }
    }
  });

  document.getElementById('aiClose').addEventListener('click', closePanel);
  document.getElementById('aiSend').addEventListener('click', send);
  aiText.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.isComposing) send(); });

  // Escape 关闭 AI 面板
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('show')) {
      closePanel();
    }
  });
  // 焦点陷阱
  document.addEventListener('keydown', function (e) { trapFocus(e); });

  // 定期提示：最多显示 3 次，面板打开时停止
  var TIP_VISIBLE = 3000;
  var TIP_INTERVAL = 8000;
  var tipShownCount = 0;
  var tipIntervalId = null;
  var tipTimeoutId = null;
  function stopTips() {
    if (tipTimeoutId) { clearTimeout(tipTimeoutId); tipTimeoutId = null; }
    if (tipIntervalId) { clearInterval(tipIntervalId); tipIntervalId = null; }
  }
  function showTip() {
    if (panel.classList.contains('show')) return;
    if (tipShownCount >= 3) { stopTips(); return; }
    if (aiTip) {
      aiTip.classList.add('show');
      tipShownCount++;
    }
    tipTimeoutId = setTimeout(function () { if (aiTip) aiTip.classList.remove('show'); }, TIP_VISIBLE);
  }
  if (aiTip) {
    tipTimeoutId = setTimeout(showTip, 4000);
    tipIntervalId = setInterval(showTip, TIP_INTERVAL);
  }

  // 仅在打开 AI 面板时按需加载外部数据，首页不预加载
  // 因此 renderQuick 可以立即渲染，数据加载由面板打开事件触发
  renderQuick();

  // 通过 #ai 链接访问时自动打开助手面板
  if (location.hash === '#ai') {
    setTimeout(function () { fab.click(); }, 300);
  }
})();
