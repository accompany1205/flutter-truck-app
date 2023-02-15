import 'package:flutter/material.dart';
import 'package:packet_truck_app/styles/colors.dart';
import 'package:packet_truck_app/styles/textStyles.dart';
import 'package:packet_truck_app/widgets/chat/bubbleReceiveMsg.dart';
import 'package:packet_truck_app/widgets/chat/bubbleSenderMsg.dart';

class MessageView extends StatelessWidget {

  String image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDOBOc038FVsxw3ysd7QljguZM-n5Ma2nOuklOmNPZibtVOf6KjQ&s';
  String testString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
          child: Column(
              children: <Widget>[
                  Container(
                      height: 60,
                    child: Stack(
                      children: <Widget>[
                        Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                                BackButton(
                                    color: primaryColor,
                                ),
                                Padding(
                                  padding: const EdgeInsets.only(right: 8, top: 3),
                                  child: ClipRRect(
                                      borderRadius: BorderRadius.all(Radius.circular(25)),
                                    child: Image.network(
                                        image,
                                        width: 50,
                                        height: 50,
                                        fit: BoxFit.fitHeight,
                                    ),
                                  ),
                                )
                            ],
                        ),
                          Padding(
                            padding: const EdgeInsets.only(top: 15),
                            child: Center(
                              child: Column(
                                  children: <Widget>[
                                      Text(
                                          'Name Surname',
                                          style: normalBoldTextStyle,
                                      ),
                                      Text(
                                          'Subtitle',
                                          style: greyLightTextStyle,
                                      ),
                                  ],
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  Flexible(
                      child: ListView(
                          children: <Widget>[
                              BubbleReceiveMessage(
                                  title: 'Hello Zak!',
                                  time: '15:00',
                              ),
                              BubbleSenderMessage(
                                  time: '15:01',
                                  title: 'Hello Mehdi!',
                              ),
                              BubbleReceiveMessage(
                                  title: testString,
                                  time: '15:00',
                              ),
                              BubbleSenderMessage(
                                  time: '15:01',
                                  title: testString,
                              ),
                              BubbleReceiveMessage(
                                  title: testString,
                                  time: '15:00',
                              ),
                              BubbleSenderMessage(
                                  time: '15:01',
                                  title: testString,
                              ),
                              BubbleReceiveMessage(
                                  title: testString,
                                  time: '15:00',
                              ),
                              BubbleSenderMessage(
                                  time: '15:01',
                                  title: testString,
                              ),
                          ],
                      ),
                  ),
                  Container(
                      color: Colors.white,
                    child: Row(
                      children: <Widget>[
                          Flexible(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 8),
                                child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10),
                                  decoration: BoxDecoration(
                                      color: lightGreyColor,
                                      borderRadius: BorderRadius.all(Radius.circular(18))
                                  ),
                                  child: TextFormField(
                                      decoration: InputDecoration(
                                          border: InputBorder.none,
                                          hintText: 'Type message...',
                                      ),
                                  ),
                                ),
                              ),
                          ),
                          Container(
                              margin: const EdgeInsets.only(right: 10),
                              height: 34,
                              width: 34,
                              child: RawMaterialButton(
                                  onPressed: () {},
                                  child: new Icon(
                                      Icons.send,
                                      color: Colors.white,
                                      size: 18.0,
                                  ),
                                  shape: new CircleBorder(),
                                  elevation: 2.0,
                                  fillColor: lightColor,
                              ),
                          ),

                      ],
                    ),
                  ),
              ],
          ),
        ),
    );
  }
}
