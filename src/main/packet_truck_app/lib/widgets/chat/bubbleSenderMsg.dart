import 'package:flutter/material.dart';
import 'package:packet_truck_app/styles/colors.dart';
import 'package:packet_truck_app/styles/textStyles.dart';

class BubbleSenderMessage extends StatelessWidget {

    final String title;
    final String time;

    const BubbleSenderMessage({Key key, this.title, this.time}) : super(key: key);


    @override
    Widget build(BuildContext context) {
        return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 17, vertical: 8),
            child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                    Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8,),
                        child: Text(
                            this.time,
                            style: greyLightTextStyle,
                        ),
                    ),
                    LayoutBuilder(
                        builder: (BuildContext context, BoxConstraints constraints){

                            return Container(
                                decoration: BoxDecoration(
                                    color: lightColor,
                                    borderRadius: BorderRadius.circular(17)
                                ),
                                child: ConstrainedBox(
                                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width*0.75),
                                    child: Padding(
                                        padding: const EdgeInsets.all(15.0),
                                        child: Text(this.title,
                                            style: whiteChatTextStyle,
                                            overflow: TextOverflow.ellipsis,
                                            maxLines: 1000,
                                        ),
                                    ),
                                ),
                            );
                        },
                    )
                ],
            ),
        );
    }
}
