$(document).ready(function(){
	describe('nar.fullReport.TimeSeriesVisualizationController', function(){
		//avoid typing namespaces
		var fullReport = nar.fullReport;
		var TimeSlider = fullReport.TimeSlider;
		var TimeRange = fullReport.TimeRange;
		var TimeSeriesVisualizationController = fullReport.TimeSeriesVisualizationController;
		//DOM fixtures
		var timeSliderElt = $('<div class="timeSlider"></div>');
		$('body').append(timeSliderElt);
		//instances:
		var timeSlider = new TimeSlider(timeSliderElt);
		var tsvController= new TimeSeriesVisualizationController(timeSlider);
		
		describe('get currently visible and possible time ranges', function(){
			it('get() should return undefined if nothing has been set yet', function(){
				var possibleTimeRange = tsvController.getPossibleTimeRange();
				expect(possibleTimeRange).toBeUndefined();
				var visibleTimeRange = tsvController.getCurrentlyVisibleTimeRange();
				expect(visibleTimeRange).toBeUndefined();
			});
		});
		//repeat tests for 'visible' and 'possible' time range accessors and mutators
		['Possible', 'CurrentlyVisible'].each(function(kind){
			describe('get and set ' + kind + ' time range', function(){
				var getTimeRange = tsvController['get' + kind + 'TimeRange'];
				var setTimeRange = tsvController['set' + kind + 'TimeRange'];
				var originalTimeRange;
				it('get() should return a time range that .equals() the one stored by set()', function(){
					originalTimeRange = new TimeRange(0, 10000);
					setTimeRange(originalTimeRange);
					expect(getTimeRange().equals(originalTimeRange)).toBe(true);
				});
				it('get() should return a clone of the time range stored by set()', function(){
					expect(getTimeRange()).not.toBe(originalTimeRange);
				});
				it('set() should store a clone of the time range passed to it, not an actual reference', function(){
					//modify the original object passed to set
					originalTimeRange.startTime += 10;
					//retrieve a copy, and check that it does not .equals()
					expect(getTimeRange().equals(originalTimeRange)).toBe(false);
				});
			});
		});
		describe('possible and visible time range interdependence', function(){
			var myTsvController;
			var largerTimeRange = new TimeRange(0, 1e6);
			var smallerTimeRange = new TimeRange(0, 1e5);
			it('should set the currently visible time range to the possible time range when the possible time range is first defined', function(){
				myTsvController = new TimeSeriesVisualizationController(timeSlider);
				expect(myTsvController.getCurrentlyVisibleTimeRange()).toBeUndefined();
				myTsvController.setPossibleTimeRange(largerTimeRange);
				expect(myTsvController.getCurrentlyVisibleTimeRange().equals(largerTimeRange)).toBe(true);
			});
			
			it('should shrink the currently visible time range if the possible time range shrinks to a range smaller than the currently visible time range', function(){
				myTsvController.setPossibleTimeRange(smallerTimeRange);
				expect(myTsvController.getCurrentlyVisibleTimeRange().equals(smallerTimeRange)).toBe(true);
			});
		});
	});
});