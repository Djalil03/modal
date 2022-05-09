let fruits = [
    {id:1, title: 'Яблоки', price: 20, img: 'https://lifeglobe.net/x/entry/6259/1a-0.jpg' },
    {id:2, title: 'Апельсины', price: 30, img: 'https://m.dom-eda.com/uploads/images/catalog/item/dfc9a3e974/3cbf3bd41c_1000.jpg' },
    {id:3, title: 'Манго', price: 40, img: 'http://www.menslife.com/upload/iblock/d23/mango.jpg' }
]

const toHtml = fruit => `<div class="col" id="col1">
<div class="card" >
    <img src="${fruit.img}" class="card-img-top" style="height: 300px; width: 345px"  alt="${fruit.title}" >
    <div class="card-body">
      <h5 class="card-title">${fruit.title}</h5>
      <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Посмотреть цену</a>
      <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Удалить</a>
    </div>
  </div>
</div>` 

function render() {
    const html = fruits.map(fruit => toHtml(fruit)).join('')
    document.querySelector('#fruits').innerHTML = html
}

render()

const priceModal = $.modal({
    title: 'Цена на Товар',
    closable: true,
    width: '600px',
    footerButtons: [
        {text: 'Закрыть',type: 'primary', handler(){
            console.log('Primary btn clicked')
            priceModal.close()
        }}
    ]

})

document.addEventListener('click' , event => {
    event.preventDefault()
    const btnType = event.target.dataset.btn
    const id = +event.target.dataset.id
    const fruit = fruits.find(f => f.id === id)

    if (btnType === 'price') {
       
        console.log('Price')
        priceModal.setContent(`<p>Цена на ${fruit.title}: <strong>${fruit.price}$</strong></p>`)
        priceModal.open()

        // console.log(id, fruit)
     }  else if (btnType === 'remove') {
         $.confirm({
             title: 'Вы уверены?',
             content: `<p>Вы удаляете фрукт: <strong>${fruit.title}</strong></p>`
         }).then(() => {
             console.log('Remove')
             fruits = fruits.filter( f => f.id !== id)
             render()
         }).catch(() => {
            console.log('Cancel')
         })
     }
})