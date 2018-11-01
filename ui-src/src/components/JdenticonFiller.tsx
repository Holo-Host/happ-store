import * as React from 'react';

export default class Jdenticon extends React.Component<any, {}> {
  private el = null
  public componentDidUpdate() {
    (window as any).jdenticon.update(this.el)
  }

  public componentDidMount() {
    (window as any).jdenticon.update(this.el)
  }

  public render () {
    const { hash, size, style } = this.props
    return <svg
      { ...this.props }
      style={{verticalAlign: 'middle', ...style}}
      ref={el => this.handleRef(el)}
      width={size}
      height={size}
      data-jdenticon-value={hash}
      />
  }

  private handleRef (el: any) {
    this.el = el
  }
}
