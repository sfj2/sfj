import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isClient: false};
        this.timer = null;
    }
    render() {
        return (
            <div>
                <div style={{textAlign: 'center',
                            fontFamily: 'Courier, serif',}}>
                    <h2>coming soon..</h2>
                    <p 
                        style={{fontSize: '20px'}}>
                        {this.getCountdown()}
                    </p>
                    <img src="http://c2.staticflickr.com/2/1596/23948188374_77061251e2_z.jpg"
                        style={{marginLeft: '-70px'}}>
                    </img>
                    <p>
                        <div style={{fontSize: '10px', color: '#aaa'}}>image courtesy</div>
                        <a 
                            href="http://sweetclipart.com/" 
                            style={{fontSize: '10px', color: '#ccc'}}>
                            www.sweetclipart.com
                        </a>
                    </p>
                </div>
            </div>
        );
    }
    getCountdown() {
        var end = new Date('06/06/2016 10:1 AM');
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;
        var _month = _day * 30;

        var now = new Date();
        var distance = end - now;

        if (distance < 0 || !this.state.isClient) {
            return 'Hello World!';
        }

        var months = Math.floor(distance / _month);
        var days = Math.floor((distance % _month) / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);

        return months + ' Mths ' + days + ' Days ' + hours + ' Hrs '
            + minutes + ' Mins ' + seconds + ' Secs';
    }
    componentDidMount() {
        var self = this;
        this.setState({isClient: true});
        this.timer = setInterval(this.forceUpdate.bind(this), 1000);
    }
    componentWillUnmount() {
        this.timer = null;
    }
}

export default Home;
