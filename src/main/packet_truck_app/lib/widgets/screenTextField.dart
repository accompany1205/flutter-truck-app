import 'package:flutter/material.dart';

double _height = 0;

class ScreenTextField extends StatelessWidget {

    final Widget child;

  ScreenTextField({Key key, this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    return LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints){

            double getHeight(){
                if(constraints.biggest.height>_height)
                    _height = constraints.biggest.height;
                return _height;
            }

            return SingleChildScrollView(
                child: Container(
                    height: getHeight(),
                    child: child
                ),
            );
        },
    );
  }
}
