import 'package:flutter/material.dart';
import 'package:packet_truck_app/styles/colors.dart';
import 'package:packet_truck_app/styles/textStyles.dart';
import 'package:packet_truck_app/views/chat/messageView.dart';


class ConversationView extends StatefulWidget {

  @override
  _ConversationViewState createState() => _ConversationViewState();
}

class _ConversationViewState extends State<ConversationView> {


    List _list = List();
    String image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDOBOc038FVsxw3ysd7QljguZM-n5Ma2nOuklOmNPZibtVOf6KjQ&s';

    @override
  void initState() {
    // TODO: implement initState
    super.initState();
    for(int i=0; i<100; i++)
        _list.add(i);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Stack(
            children: <Widget>[
              Container(
                height: 140,
                color: primaryColor,
              ),
              Column(
                  children: <Widget>[
                      Container(
                          color: primaryColor,
                          height: 130,
                          child: Align(
                              alignment: Alignment.bottomLeft,
                              child: Padding(
                                padding: const EdgeInsets.only(left: 12, bottom: 12),
                                child: Text('Chats', style: titleWhiteBoldTextStyle,),
                              )
                          ),
                      ),
                      Container(
                          color: primaryColor,
                        child: Container(
                            decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: const BorderRadius.only(
                                    topLeft: const Radius.circular(30),
                                    topRight: const Radius.circular(30),
                                )
                            ),
                            height: (_list.length*72.0)+30,
                            child: ListView.builder(
                                physics: NeverScrollableScrollPhysics(),
                                itemCount: _list.length,
                                itemBuilder: (context, index){
                                    return ListTile(
                                      title: Text('Name Surname $index'),
                                        subtitle: Text('Subtitle', style: greyLightTextStyle,),
                                        trailing: Text('15:00', style: greyLightTextStyle,),
                                        leading: Padding(
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
                                        ),
                                        onTap: (){
                                            Navigator.push(
                                                context,
                                                MaterialPageRoute(
                                                    builder: (context) =>  MessageView()
                                                ));
                                        },
                                    );
                                },

                            )
                        ),
                      ),
                  ],
              ),
            ],
          ),
        ),
    );
  }
}
