import React from 'react';
import { StyleSheet, Text, Image, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import { Button} from 'native-base';
import * as CB from 'cloudboost'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class App extends React.Component {

  constructor(props) {
    super(props);

    CB.CloudApp.init('kaxtppzlfgps', '442f6e7b-39be-4b39-aa73-a21eaa5a3d57');

    this.state = {
      overview: true,
      reviews: false,
      textValue: '',
      booleanValue: false,
      hasCameraPermission: null,
      image: 'https://wallpapershome.com/images/pages/pic_h/5197.jpg',
    }

    const self = this;

    const query = new CB.CloudQuery('Tours');
    query.equalTo('name','Antelope Canyon');
    query.find({
      success: function(list) {
        //list is an array of CloudObjects
        if (!list[0].get('bookmarked')) {
          self.setState({
            booleanValue: false
          });
        } else {
          self.setState({
            booleanValue: true
          });
        }

        if (!list[0].get('booked')) {
          self.setState({
            textValue: 'Book Now'
          });
        } else {
          self.setState({
            textValue: 'Unbook'
          });
        }
      },
      error: function(error) {
      }
    });
  }

  async componentDidMount() {
    const obj = new CB.CloudObject('Tours');
    obj.set('name', 'Antelope Canyon');
    obj.set('top_review', 'Most breathtaking tour ever!!!');
    obj.set('bookmarked', false);
    obj.set('booked', false);
    obj.save({
      success: function (obj) {
        //obj saved.
      }, error: function (error) {
        //error
      }
    });

    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  onOverview = () => {
    this.setState({overview: true});
    this.setState({reviews: false});
  }

  onReviews = () => {
    this.setState({overview: false});
    this.setState({reviews: true});
  }

  onBookmarked = () => {
    const self = this;
    const query = new CB.CloudQuery('Tours');
    query.equalTo('name','Antelope Canyon');
    query.find({
      success: function(list) {
        //list is an array of CloudObjects
        if (!list[0].get('bookmarked')) {
          list[0].set('bookmarked', true);
          self.setState({
            booleanValue: true
          });
        } else {
          list[0].set('bookmarked', false);
          self.setState({
            booleanValue: false
          });
        }

        list[0].save({
          success: function (obj) {
            //obj saved.
          }, error: function (error) {
            //error
          }
        });
      },
      error: function(error) {
      }
    });
  }

  onBooked = () => {
    const self = this;
    const query = new CB.CloudQuery('Tours');
    query.equalTo('name','Antelope Canyon');
    query.find({
      success: function(list) {
        //list is an array of CloudObjects
        if (!list[0].get('booked')) {
          list[0].set('booked', true);
          self.setState({
            textValue: 'Unbook'
          });
        } else {
          list[0].set('booked', false);
          self.setState({
            textValue: 'Book Now'
          });
        }

        list[0].save({
          success: function (obj) {
            //obj saved.
          }, error: function (error) {
            //error
          }
        });
      },
      error: function(error) {
      }
    });
  }

  getPhotoLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }

  render() {
    return (
      <View style={style.container}>
        <View style={image.container}>
          <TouchableHighlight onPress={()=>this.getPhotoLibrary()}>
            <Image style={image.dimensions} source={{uri: this.state.image}} />
          </TouchableHighlight>
          <View style={back.container}>
            <Icon
              name='chevron-left'
              type='font-awesome'
              color='#fff'
            />
          </View>
          <View style={title.container}>
            <Text style={title.titleText}>Breathtaking Antelope Canyon Tour</Text>
          </View>
          <View style={feedback.container}>
            <View style={rating.container}>
              <Icon
                name='star'
                type='font-awesome'
                color='#d4af37'
              />
              <Text style={rating.ratingText}>5.0</Text>
            </View>
            <Text style={feedback.feedbackText}>472 reviews</Text>
          </View>
        </View>
        <View style={[{position: 'absolute', top:'55%', right: 16 }]}>
          <Icon
            raised = {!this.state.booleanValue}
            reverse = {this.state.booleanValue}
            name='bookmark'
            type='font-awesome'
            color='#d32411'
            onPress={() => this.onBookmarked()} />
        </View>
        <View style={[{flex: 1, flexDirection: 'row'}]}>
          {this.state.overview && <Text style={{position: 'absolute', right: '27%', top: '65%', color: '#d32411', fontSize: 18, fontWeight: 'bold'}}>Overview</Text>}
          {this.state.reviews && <Text style={{position: 'absolute', right: '27%', top: '65%', color: '#c0c0c0', fontSize: 18, fontWeight: 'bold'}} onPress={this.onOverview}>Overview</Text>}
          {this.state.overview && <Text style={{position: 'absolute', right: '35%', top: '65%', color: '#d32411', fontSize: 50, fontWeight: 'bold'}}>.</Text>}
          {this.state.overview && <Text style={{position: 'absolute', left: '-20%', top: '65%', color: '#c0c0c0', fontSize: 18, fontWeight: 'bold'}} onPress={this.onReviews}>Reviews</Text>}
          {this.state.reviews && <Text style={{position: 'absolute', left: '-20%', top: '65%', color: '#d32411', fontSize: 18, fontWeight: 'bold'}}>Reviews</Text>}
          {this.state.reviews && <Text style={{position: 'absolute', right: '11%', top: '65%', color: '#d32411', fontSize: 50, fontWeight: 'bold'}}>.</Text>}
          {this.state.overview && <Text style={{position: 'absolute', right: '15%', top: '74%', color: '#c0c0c0', fontSize: 18, fontWeight: 'bold'}}>PRICE</Text>}
          {this.state.overview && <Text style={{position: 'absolute', left: '24%', top: '73%', color: '#c0c0c0', fontSize: 18, fontWeight: 'bold'}}>DURATION</Text>}
          {this.state.overview && <Text style={{position: 'absolute', right: '7%', top: '77%', color: '#000000', fontSize: 36, fontWeight: 'bold'}}>$158</Text>}
          {this.state.overview && <Text style={{position: 'absolute', left: '24%', top: '76%', color: '#000000', fontSize: 32, fontWeight: 'bold'}}>3</Text>}
          {this.state.overview && <Text style={{position: 'absolute', left: '30%', top: '78%', color: '#000000', fontSize: 18, fontWeight: 'bold'}}>hours</Text>}
          {this.state.overview && <View style={[{position: 'absolute', right: '30%', top: '74%', backgroundColor: '#c0c0c0'}]}>
            <Icon
              reverse
              name='tag'
              type='font-awesome'
              color='#d32411'
            />
          </View>}
          {this.state.overview && <View style={[{position: 'absolute', left: '3%', top: '74%', backgroundColor: '#c0c0c0'}]}>
            <Icon
              reverse
              name='clock-o'
              type='font-awesome'
              color='#d32411'
            />
        </View>}
        </View>
        <View style={[{ position: 'absolute', left: 18, bottom: '8%', width: '100%' }]}>
          {this.state.overview && <Text style ={{fontSize: 18, fontWeight: 'bold', textAlign: 'left', color: '#000000'}}>During Antelope Canyon tour, you'll see how</Text>}
          {this.state.overview && <Text style ={{fontSize: 18, fontWeight: 'bold', textAlign: 'left', color: '#c0c0c0'}}>Antelope Canyon was formed - by millions of</Text>}
          {this.state.reviews && <Text style = {{fontSize: 18, fontWeight: 'bold', textAlign: 'left', color: '#000000'}}>Most breathtaking tour ever!!!</Text>}
        </View>
        <View style={[{ position: 'absolute', bottom: 0, width: '100%' }]}>
            <Button onPress={this.onBooked} backgroundColor='#d32411'  justifyContent='center'>
              <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: "#fff"}} uppercase={false}>{this.state.textValue}</Text>
            </Button>
          </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const image = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '60%',
  },
  dimensions: {
    width: '100%',
    height: '100%',
  }
});

const back = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    top:32,
  }
});

const title = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    width: 300
  },
  titleText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
  }
});

const feedback = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 24,
    bottom: 142,
  },
  feedbackText: {
    color: '#ffffff',
    fontSize: 12,
  }
});

const rating = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  ratingText: {
    position: 'absolute',
    left: 40,
    bottom: 0,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingImage: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 100,
    height: 100,
  }
});
