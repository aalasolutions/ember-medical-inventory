import Service from '@ember/service';

export default class ToastService extends Service {

    show(msg, position, duration){
        if(!position) position = 'bottom';
        if(!duration) duration = 1500;

        if(window && window.plugins && window.plugins.toast){
            window.plugins.toast.show(msg, 1500, 'bottom');
        }else{
            console.log('Toast Plugin is disabled', msg);
        }
    }
}
