export default function(direction) {
	if (
		direction.split(', ')[1] !== undefined &&
		direction.split(', ')[1].length > 4
	) {
		//if the destiantion has weird commas in it! but we don't want to wind up with Hbf either
		direction = direction.split(', ')[1];
	}

	//strip S + U
	if (direction.split('S ')[1] !== undefined) {
		direction = direction.split('S ')[1];
	}
	if (direction.split('U ')[1] !== undefined) {
		direction = direction.split('U ')[1];
	}

	//make ringbahn nice (remove the line number)
	if (direction.split('S41')[1] !== undefined) {
		direction = direction.split('S41')[0] + direction.split('S41')[1];
	}
	if (direction.split('S42')[1] !== undefined) {
		direction = direction.split('S42')[0] + direction.split('S42')[1];
	}

	return direction;
}
