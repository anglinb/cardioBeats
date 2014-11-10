cardioBeats
=====

A Myo-Powered adaptive music play. Jog with you Myo and cardioBeats speeds up or slows down your music--Built in 48 hours at #HackSC


We used the Myo SDK written in C++ to grab orientation data. We passed this to python and processed the signal. We basically used a three point analysis to find local minimum and maximums.


	^ Pitch 
	|			+
	|		+	|	+
	|	+		|	|
	|	|		|	|
	|	|		|	|
	|	|		|	|
	|	a       b   c
	|
	|	a->b     b->c
	|	 1        -1
	|
	+-------------------------------> Time

When we find two slopes that have opposite signs we know we have a min or a max. We also add a thresholding system so that we would only pick up large movements

	*		*
		*	

vs
	
	*								*
		*						*
			*				*
				*		*
					*

The second curve is probably a significant movement while the first would give us a very short wavelength. 

Once we have found a min or max we compare it to the prevoius to find the wavelength. Based on our calibrations we used this wavelength to adjust the tempo of the music. 
