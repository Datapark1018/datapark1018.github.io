// 프로젝트 데이터
const projectData = {
    1: {
        title: "스마트 ITS 교통 시스템 구축",
        overview: "실시간 교통 데이터를 수집하고 분석하여 교통 흐름을 최적화하는 스마트 교통 시스템을 구축했습니다. CCTV 영상 분석과 센서 데이터를 활용하여 교통 상황을 실시간으로 모니터링하고 예측합니다.",
        features: [
            "실시간 교통량 모니터링 및 분석",
            "AI 기반 교통 흐름 예측",
            "신호등 최적화 알고리즘 구현",
            "모바일 앱을 통한 실시간 교통 정보 제공"
        ],
        tech: [
            "Python",
            "TensorFlow",
            "OpenCV",
            "Django",
            "React Native",
            "PostgreSQL"
        ],
        role: "팀장으로서 프로젝트 기획부터 개발, 배포까지 전 과정을 주도했습니다. 특히 AI 모델 개발과 실시간 데이터 처리 파이프라인 구축을 담당했습니다."
    },
    2: {
        title: "AI 기반 데이터 분석 자동화 플랫폼",
        overview: "기업의 데이터 분석 프로세스를 자동화하고 효율화하는 AI 기반 플랫폼을 개발했습니다. 데이터 전처리부터 분석, 시각화까지 전 과정을 자동화하여 분석 시간을 크게 단축했습니다.",
        features: [
            "자동 데이터 전처리 및 정제",
            "AI 기반 이상치 탐지",
            "자동 보고서 생성",
            "실시간 데이터 모니터링"
        ],
        tech: [
            "Python",
            "Scikit-learn",
            "FastAPI",
            "React",
            "Docker",
            "AWS"
        ],
        role: "백엔드 개발 및 AI 모델 구현을 담당했습니다. 특히 데이터 파이프라인 구축과 자동화 알고리즘 개발에 중점을 두었습니다."
    }
    // 나머지 프로젝트 데이터는 필요에 따라 추가
};

// 모달 관련 요소
const modal = document.getElementById('projectModal');
const closeBtn = document.querySelector('.close-modal');
const modalBody = document.querySelector('.modal-body');

// 간단한 마크다운 변환 함수 (제목, 리스트, 줄바꿈)
function simpleMarkdownToHtml(md) {
    // Blockquotes
    md = md.replace(/^> ?(.*)$/gm, '<blockquote>$1</blockquote>');
    // Code (inline)
    md = md.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Nested list support (robust: always nest <ul> inside parent <li>)
    function parseList(lines, indent = 0) {
        let html = '';
        let inList = false;
        while (lines.length) {
            let line = lines[0];
            let match = line.match(/^(\s*)- (.*)$/);
            if (match) {
                let currIndent = match[1].length;
                if (currIndent < indent) break;
                lines.shift();
                if (!inList) { html += '<ul>'; inList = true; }
                let content = match[2];
                // 하위 리스트 감지
                let subLines = [];
                while (lines.length) {
                    let next = lines[0];
                    let nextMatch = next.match(/^(\s*)- (.*)$/);
                    if (!nextMatch || nextMatch[1].length <= currIndent) break;
                    subLines.push(lines.shift());
                }
                if (subLines.length) {
                    html += '<li>' + content + parseList(subLines, currIndent + 2) + '</li>';
                } else {
                    html += '<li>' + content + '</li>';
                }
            } else {
                break;
            }
        }
        if (inList) html += '</ul>';
        return html;
    }
    // 리스트 변환
    let lines = md.split(/\r?\n/);
    let html = '';
    while (lines.length) {
        if (/^\s*- /.test(lines[0])) {
            html += parseList(lines);
        } else {
            html += lines.shift() + '\n';
        }
    }
    md = html;

    // bold 처리
    md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
           .replace(/__(.*?)__/g, '<strong>$1</strong>');
    // 제목 변환
    md = md.replace(/^### (.*)$/gim, '<h3>$1</h3>')
           .replace(/^## (.*)$/gim, '<h2>$1</h2>')
           .replace(/^# (.*)$/gim, '<h1>$1</h1>');
    // 남은 줄바꿈 2개 이상은 <br>
    md = md.replace(/\n{2,}/g, '<br>');
    // 남은 한 줄짜리 줄바꿈은 공백으로 치환
    md = md.replace(/\n/g, ' ');
    return md;
}

// 모달 열기
// 기존 projectData 사용 X, md 파일 fetch

// 기존 .view-project 이벤트 제거 후 새로 등록

document.querySelectorAll('.view-project').forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const projectId = button.getAttribute('data-project');
        const mdPath = `static/md/project${projectId}.md`;
        try {
            const res = await fetch(mdPath);
            if (!res.ok) throw new Error('MD 파일을 불러올 수 없습니다.');
            const md = await res.text();
            // 마크다운을 HTML로 변환
            const html = `<div class='modal-markdown'>${simpleMarkdownToHtml(md)}</div>`;
            modalBody.innerHTML = html;
            modal.style.display = 'block';
        } catch (err) {
            modalBody.innerHTML = '<p style="color:red">프로젝트 상세 내용을 불러올 수 없습니다.</p>';
            modal.style.display = 'block';
        }
    });
});

// 모달 닫기
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 모달 외부 클릭시 닫기
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 이미지 클릭 시 모달 열기 (Details 버튼과 동일하게 동작)
document.querySelectorAll('.project-image img').forEach(img => {
    img.addEventListener('click', function(e) {
        // 가장 가까운 project-card에서 data-project 값을 찾음
        let card = img.closest('.project-card');
        let btn = card.querySelector('.view-project');
        if (btn) btn.click();
    });
});

// h3 클릭 시 모달 열기 (Details 버튼과 동일하게 동작)
document.querySelectorAll('.project-content h3').forEach(h3 => {
    h3.addEventListener('click', function(e) {
        let card = h3.closest('.project-card');
        let btn = card.querySelector('.view-project');
        if (btn) btn.click();
    });
}); 