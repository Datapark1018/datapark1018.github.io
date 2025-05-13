// 모달 관련 요소
let careerModal;
let careerCloseBtn;
let careerModalBody;

// 간단한 마크다운 변환 함수 (제목, 리스트, 줄바꿈)
function simpleMarkdownToHtml(md) {
    // Blockquotes
    md = md.replace(/^> ?(.*)$/gm, '<blockquote>$1</blockquote>');
    // Code (inline)
    md = md.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Nested list support
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

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // 모달 관련 요소 초기화
    careerModal = document.getElementById('careerModal');
    careerCloseBtn = document.querySelector('.close-career-modal');
    careerModalBody = document.querySelector('.career-modal-body');
    
    if (!careerModal || !careerCloseBtn || !careerModalBody) {
        console.error('Career modal elements not found');
        return;
    }
    
    console.log('Modal elements:', { careerModal, careerCloseBtn, careerModalBody });

    // 모달 열기
    const careerButtons = document.querySelectorAll('.career-detail-btn');
    console.log('Career buttons found:', careerButtons.length);
    
    careerButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            console.log('Career button clicked:', button.getAttribute('data-career'));
            e.preventDefault();
            e.stopPropagation();
            
            const careerId = button.getAttribute('data-career');
            const mdPath = `static/md/career${careerId}.md`;
            try {
                console.log('Fetching markdown from:', mdPath);
                const res = await fetch(mdPath);
                if (!res.ok) throw new Error('MD 파일을 불러올 수 없습니다.');
                const md = await res.text();
                console.log('Markdown loaded successfully');
                
                // 마크다운을 HTML로 변환
                const html = `<div class='modal-markdown'>${simpleMarkdownToHtml(md)}</div>`;
                careerModalBody.innerHTML = html;
                careerModal.style.display = 'block';
                console.log('Modal displayed');
            } catch (err) {
                console.error('Error loading career details:', err);
                careerModalBody.innerHTML = '<p style="color:red">경력 상세 내용을 불러올 수 없습니다.</p>';
                careerModal.style.display = 'block';
            }
        });
    });

    // 모달 닫기
    careerCloseBtn.addEventListener('click', (e) => {
        console.log('Close button clicked');
        e.preventDefault();
        e.stopPropagation();
        careerModal.style.display = 'none';
    });

    // 모달 외부 클릭시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === careerModal) {
            console.log('Modal background clicked');
            careerModal.style.display = 'none';
        }
    });
}); 