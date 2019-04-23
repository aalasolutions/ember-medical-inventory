export default function () {
  // Add your transitions here, like:
  this.transition(
    this.fromRoute('categories'),
    this.toRoute('medicines'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  this.transition(
    this.fromRoute('medicines'),
    this.toRoute('inventory'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  this.transition(
    this.fromRoute('inventory'),
    this.toRoute('categories'),
    this.use('toRight'),
  );


  this.transition(
    this.hasClass('addNew'),
    this.toValue(true),
    this.use('crossFade', {duration: 250}),

    // which means we can also apply a reverse rule for transitions to
    // the false state.
    this.reverse('crossFade', {duration: 250})
  );
}
