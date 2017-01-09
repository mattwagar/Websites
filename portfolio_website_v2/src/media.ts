export * from "./media";

export class MediaItem{
    media: Media;
    html: HTMLDivElement;
    order: number;
    constructor(media: Media, html:HTMLDivElement, order: number){
        const vm = this;
        vm.media = media;
        vm.html = html;
        vm.order = order;
        vm.html.onclick = function(){
            vm.media.loadMedia(vm.order);
        }
    }
}

export class Media {
    id:string
    elements: any[];
    thumbnails: HTMLImageElement[];
    media_items: MediaItem[];
    selected: number;
    vimeo:string;

    row:HTMLDivElement;
    overlay:HTMLDivElement;
    colmd:HTMLDivElement;
    
    media_selected:HTMLDivElement;
    constructor(id: string, thumbnails: string[], files?: string[], vimeo?: string){
        const vm = this;
        vm.id = id;
        vm.selected = 0;
        vm.elements = [];
        vm.media_items = [];
        vm.thumbnails = [];

        vm.vimeo = vimeo;
        if(vimeo){
                var frag = vm.createFragment(vimeo);
                vm.elements.push(frag);
                // vm.elements[i].classList.add('dropshadow');
        }

        var length = vm.elements.length;
        if(files){
            for(var i = 0; i < files.length; i++){
                var image = document.createElement('img')
                image.src = files[i];
                image.classList.add('dropshadow');
                vm.elements.push(image);
            }
        }

        vm.media_selected = document.createElement('div');
        vm.media_selected.id = 'media-selected';

        vm.overlay = document.createElement('div');
        vm.overlay.classList.add('overlay-media');

        vm.media_selected.appendChild(vm.overlay);

        vm.row = document.createElement('div');
        vm.row.classList.add('row','justify-center','media-container');

        for(var j = 0; j < vm.elements.length; j++){
            vm.colmd = document.createElement('div');
            vm.colmd.classList.add('col-md');

            var html = document.createElement('div')
            html.classList.add('media-item');
            var media_item = new MediaItem(vm,html,j);
            vm.media_items.push(media_item);

            vm.thumbnails.push(document.createElement('img'));
            vm.thumbnails[j].classList.add('dropshadow');
            vm.thumbnails[j].src = thumbnails[j];

            vm.colmd.appendChild(vm.media_items[j].html);
            vm.colmd.appendChild(vm.thumbnails[j]);
            vm.row.appendChild(vm.colmd);
            
        }
        //          #media-selected
        //              .overlay
        //              img(src="./portfolio/breathless.jpg").dropshadow
        //          .row.justify-center.media-container
        //              .col-md
        //                  .media-item
        //                  img(src="./portfolio/breathless.jpg").dropshadow
        //              .col-md
        //                  .media-item
        //                  img(src="./portfolio/breathless.jpg").dropshadow


        vm.media_items[vm.selected].html.classList.add('selected');
        // vm.elements.push(vm.elements[0]);
        // vm.elements.shift();
        // vm.setId(id);
        // vm.loadMedia(0);

    }
    createFragment(str: string, width?: number, height?: number ) {
        var newstr = str;
        if(width){
            
            newstr = str.replace('width="\d+" height="\d+"', 'width="'+width+'" height="'+height+'"');
            
        }

        var frag = document.createDocumentFragment();

        var elem = document.createElement('div');
        elem.innerHTML = str;

        while (elem.childNodes[0]) {
            frag.appendChild(elem.childNodes[0]);
        }
        return frag;
    }

    setId(id: string){
        const vm = this;
        var parent = document.getElementById(id);
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
        parent.appendChild(vm.media_selected);
        parent.appendChild(vm.row);
    }

    loadMedia(thumb_num:number){
        const vm = this;
                // vm.media_selected.removeChild(vm.media_selected.firstChild);
        vm.overlay.classList.add('close-media');

        vm.overlay.style.width = (vm.media_selected.clientWidth+12)+'px';
        vm.overlay.style.height = (vm.media_selected.clientHeight+8)+'px';

        for(var i = 0; i < vm.media_items.length; i++){
            vm.media_items[i].html.style.width = vm.colmd.clientWidth+'px';
            vm.media_items[i].html.style.height = vm.colmd.clientHeight+'px';
        }

        if(vm.vimeo && thumb_num === 0){
                vm.elements.shift();
                var frag = vm.createFragment(vm.vimeo, vm.media_selected.clientWidth, vm.media_selected.clientHeight);
                vm.elements.unshift(frag);

                vm.overlay.style.visibility = 'hidden';
                // vm.elements[i].classList.add('dropshadow');
        } else {
            vm.overlay.style.visibility = 'visible';
        }


        /*button transition*/
        vm.media_items[vm.selected].html.classList.remove('selected');
        vm.selected = thumb_num;
        vm.media_items[vm.selected].html.classList.add('selected');

        /*picture transition*/
        setTimeout(function(){

            // if(vm.vimeo && vm.selected === 0){

            // }

            if (vm.media_selected.children.length === 2) {
                vm.media_selected.removeChild(vm.media_selected.lastChild);
            }

            vm.media_selected.appendChild(vm.elements[vm.selected]);
            vm.overlay.classList.remove('close-media');
            vm.media_items[vm.selected].html.classList.add('selected');
        }, 600);   
    }
}