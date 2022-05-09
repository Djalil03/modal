Element.prototype.appendAfter = function(element) {
    element.parentNode.insertBefore(this, element.nextSibling)
}

function noop() {}

function _createModalFooter(buttons = []) {
    if (buttons.length === 0) {
        document.createElement('div')
    }

    const wrap = document.createElement('div')
    wrap.classList.add('modal-footer')

    buttons.forEach(btn => {
        const $btn = document.createElement('button')
        $btn.textContent = btn.text 
        $btn.classList.add('btn')
        $btn.classList.add(`btn-${btn.type || 'secondary'}`)
        $btn.onclick = btn.handler || noop

        wrap.appendChild($btn)
    })

    return wrap
}


function _createModal(options) {
    const DEFAULT_WIDTH = '600px'
    const modal = document.createElement('div')
    modal.classList.add('vmodal')
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay" data-close='true'>
            <div class="modal-window" id='modalW' style="width: ${options.width || DEFAULT_WIDTH}">
                <div class="modal-header">
                    <span class="modal-title">${options.title || 'Окно'}</span>
                   ${options.closable ? `<span class="modal-close" id='close' data-close='true' >&times;</span>` : ''}
                </div>
                <div class="modal-body" data-content>
                    ${options.content || ''}  
                </div>
            </div>
        </div>
    `)
    const footer = _createModalFooter(options.footerButtons)
    footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.appendChild(modal)
    return modal
}

$.modal = function(options) {
    const ANIMATION_SPEED = 200
    const $modal = _createModal(options)
    let closing = false 
    let closable = true 
    let destroyed = false 

    const modal = {
        open() {
            if (destroyed) {
                return console.log('Modal destroyed')
            }
           !closing && $modal.classList.add('open')  // если не closing тогда мы уже добавляем класс open 
        },
        close() {
            closing = true 
            $modal.classList.remove('open')
            $modal.classList.add('hide')
            setTimeout(() => {
                $modal.classList.remove('hide')
                closing = false
                if (typeof options.onClose === 'function') {
                    options.onClose()
                }
            },ANIMATION_SPEED)
        }
    }

    const listener = event => {
        console.log('Clicked', event.target.dataset.close)
        if (event.target.dataset.close){
            modal.close()
        }
    }

    $modal.addEventListener('click', listener)
   
    return Object.assign(modal, {
        destroy() {
            $modal.parentNode.removeChild($modal)
            $modal.removeEventListener('click', listener)
            destroyed = true 
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html   // в modal-body добавил дата атрибут 'data-content' , с помощью селектора нахожу его прописывая в кавычках и квадратных скобках , и с помощью innerHTML могу вставлять принимаемый в метод заданный параметр 'html'
        } 
        
    })
}
